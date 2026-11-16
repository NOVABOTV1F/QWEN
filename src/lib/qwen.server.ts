import { randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";
import tls from "node:tls";
import { getSql, type Sql } from "@/lib/db";
import { env } from "@/lib/env.server";
import type {
  AdminBoard,
  AdminSession,
  Fail,
  Inbox,
  OtpTicket,
  PublicConfig,
  SessionUser,
  StudioSettings,
} from "@/lib/qwen-types";

// Admin login lives in environment variables (set them on your host, never in code):
// ADMIN_USER, ADMIN_PASS, ADMIN_GMAIL, ADMIN_KEY
function adminConfig() {
  return {
    user: env("ADMIN_USER") ?? "",
    pass: env("ADMIN_PASS") ?? "",
    gmail: (env("ADMIN_GMAIL") ?? "").toLowerCase(),
    key: env("ADMIN_KEY") ?? "",
  };
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 32).toString("hex");
  return { hash, salt };
}

function token() {
  return randomBytes(32).toString("hex");
}

function otpCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function fail(error: string): Fail {
  return { ok: false, error };
}

function asNum(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function asBool(value: unknown) {
  return value === true || value === "t" || value === "true" || value === 1;
}

function cleanMail(value: string) {
  return value.trim().toLowerCase();
}

function isGmail(value: string) {
  return /^[a-z0-9._%+-]+@gmail\.com$/.test(value);
}

function cleanLink(value: string) {
  const link = value.trim();
  if (!link) return "";
  if (link.length > 500) return null;
  if (link.startsWith("/") && !link.startsWith("//") && !link.includes(" ")) return link;
  try {
    const url = new URL(link);
    if (url.protocol === "https:" || url.protocol === "http:") return link;
  } catch {
    return null;
  }
  return null;
}

async function setting(sql: Sql, key: string) {
  const rows = await sql<{ value: string }>`select value from qwen_settings where key = ${key}`;
  return rows[0]?.value ?? "";
}

async function putSetting(sql: Sql, key: string, value: string) {
  await sql`
    insert into qwen_settings (key, value) values (${key}, ${value})
    on conflict (key) do update set value = excluded.value
  `;
}

async function logActivity(sql: Sql, kind: string, detail: string) {
  await sql`
    insert into qwen_activity (id, kind, detail)
    values (${crypto.randomUUID()}, ${kind}, ${detail.slice(0, 240)})
  `;
}

function sendOtpMail(user: string, pass: string, to: string, code: string, subject = "Kode OTP QWEN GENERETE") {
  const message = [
    `From: QWEN GENERETE <${user}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    `Kode OTP kamu: ${code}`,
    "",
    "Kode berlaku 10 menit.",
    "QWEN GENERETE",
  ].join("\r\n");
  const queue = [
    "EHLO qwen.generete",
    "AUTH LOGIN",
    Buffer.from(user, "utf8").toString("base64"),
    Buffer.from(pass, "utf8").toString("base64"),
    `MAIL FROM:<${user}>`,
    `RCPT TO:<${to}>`,
    "DATA",
    `${message}\r\n.`,
    "QUIT",
  ];

  return new Promise<void>((resolve, reject) => {
    const sock = tls.connect({
      host: "smtp.gmail.com",
      port: 465,
      servername: "smtp.gmail.com",
    });
    let buf = "";
    let step = 0;
    const stop = (error: Error) => {
      sock.destroy();
      reject(error);
    };
    const writeNext = () => {
      const line = queue[step];
      if (line === undefined) return;
      step += 1;
      sock.write(`${line}\r\n`);
    };
    sock.setTimeout(12_000, () => stop(new Error("SMTP timeout")));
    sock.on("error", stop);
    sock.on("data", (chunk) => {
      buf += chunk.toString("utf8");
      if (!buf.endsWith("\n")) return;
      const lines = buf.split(/\r?\n/).filter((line) => line.length > 0);
      const last = lines[lines.length - 1] ?? "";
      if (/^\d{3}-/.test(last)) return;
      buf = "";
      const status = Number(last.slice(0, 3));
      if (!Number.isFinite(status) || status >= 400) {
        stop(new Error("Gmail menolak kiriman"));
        return;
      }
      if (step >= queue.length) {
        sock.end();
        resolve();
        return;
      }
      writeNext();
    });
  });
}

export async function issueRegisterOtp(input: {
  name: string;
  password: string;
  gmail: string;
}): Promise<OtpTicket | Fail> {
  const sql = await getSql();
  const name = input.name.trim();
  const gmail = cleanMail(input.gmail);
  const password = input.password;
  if (name.length < 1 || name.length > 80) return fail("Isi nama.");
  if (password.length < 8) return fail("Sandi minimal 8 karakter.");
  if (password.length > 200) return fail("Sandi terlalu panjang.");
  if (!isGmail(gmail)) return fail("Pakai alamat Gmail.");

  const existing = await sql<{ id: string }>`select id from qwen_users where gmail = ${gmail}`;
  if (existing.length > 0) return fail("Gmail ini sudah terdaftar. Masuk lewat login.");

  const { hash, salt } = hashPassword(password);
  const code = otpCode();
  await sql`
    insert into qwen_reg_otp (gmail, name, password_hash, password_salt, code, expires_at)
    values (${gmail}, ${name}, ${hash}, ${salt}, ${code}, now() + interval '10 minutes')
    on conflict (gmail) do update set
      name = excluded.name,
      password_hash = excluded.password_hash,
      password_salt = excluded.password_salt,
      code = excluded.code,
      expires_at = excluded.expires_at
  `;
  await logActivity(sql, "daftar", `${name} · ${gmail}`);

  const smtpUser = await setting(sql, "smtp_user");
  const smtpPass = await setting(sql, "smtp_pass");
  if (smtpUser && smtpPass) {
    try {
      await sendOtpMail(smtpUser, smtpPass, gmail, code);
      return { ok: true, delivered: true, code: null };
    } catch {
      return { ok: true, delivered: false, code };
    }
  }
  return { ok: true, delivered: false, code };
}

export async function confirmRegister(input: { gmail: string; code: string }): Promise<Fail | { ok: true }> {
  const sql = await getSql();
  const gmail = cleanMail(input.gmail);
  const code = input.code.trim();
  const rows = await sql<{
    name: string;
    password_hash: string;
    password_salt: string;
    code: string;
  }>`
    select name, password_hash, password_salt, code
    from qwen_reg_otp
    where gmail = ${gmail} and expires_at > now()
  `;
  const row = rows[0];
  if (!row || !safeEqual(row.code, code)) return fail("Kode OTP salah atau sudah kedaluwarsa.");

  const id = crypto.randomUUID();
  try {
    await sql`
      insert into qwen_users (id, name, gmail, password_hash, password_salt)
      values (${id}, ${row.name}, ${gmail}, ${row.password_hash}, ${row.password_salt})
    `;
  } catch {
    return fail("Gmail ini sudah terdaftar. Masuk lewat login.");
  }
  await sql`delete from qwen_reg_otp where gmail = ${gmail}`;
  await logActivity(sql, "akun", `Akun jadi · ${row.name}`);
  return { ok: true };
}

export async function loginUser(input: { name: string; gmail: string }): Promise<SessionUser | Fail> {
  const sql = await getSql();
  const name = input.name.trim();
  const gmail = cleanMail(input.gmail);
  const rows = await sql<{ id: string; name: string; gmail: string; banned: boolean }>`
    select id, name, gmail, banned from qwen_users
    where gmail = ${gmail} and lower(name) = ${name.toLowerCase()}
  `;
  const row = rows[0];
  if (!row) return fail("Nama dan Gmail tidak cocok.");
  if (asBool(row.banned)) return fail("Akun ini dikunci owner.");
  const session = token();
  await sql`insert into qwen_sessions (token, user_id) values (${session}, ${row.id})`;
  await logActivity(sql, "masuk", `${row.name} masuk`);
  return { ok: true, token: session, name: row.name, gmail: row.gmail };
}

async function userIdFor(sql: Sql, session: string) {
  if (!/^[a-f0-9]{64}$/.test(session)) return null;
  const rows = await sql<{ user_id: string }>`
    select user_id from qwen_sessions where token = ${session}
  `;
  return rows[0]?.user_id ?? null;
}

async function requireUser(sql: Sql, session: string): Promise<{ id: string } | { error: string }> {
  const id = await userIdFor(sql, session);
  if (!id) return { error: "Sesi habis. Masuk lagi." };
  const rows = await sql<{ banned: boolean }>`select banned from qwen_users where id = ${id}`;
  const row = rows[0];
  if (!row) return { error: "Sesi habis. Masuk lagi." };
  if (asBool(row.banned)) return { error: "Akun ini dikunci owner." };
  return { id };
}

export async function readSession(session: string): Promise<SessionUser | Fail> {
  const sql = await getSql();
  const id = await userIdFor(sql, session);
  if (!id) return fail("Sesi habis. Masuk lagi.");
  const rows = await sql<{ name: string; gmail: string; banned: boolean }>`
    select name, gmail, banned from qwen_users where id = ${id}
  `;
  const row = rows[0];
  if (!row) return fail("Sesi habis. Masuk lagi.");
  if (asBool(row.banned)) return fail("Akun ini dikunci owner.");
  return { ok: true, token: session, name: row.name, gmail: row.gmail };
}

export async function logoutUser(session: string) {
  const sql = await getSql();
  if (/^[a-f0-9]{64}$/.test(session)) {
    await sql`delete from qwen_sessions where token = ${session}`;
  }
  return { ok: true as const };
}

async function inboxItems(sql: Sql, userId: string) {
  const rows = await sql<{ address: string; created_at: string; code: string | null }>`
    select a.address,
      to_char(a.created_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI') as created_at,
      (
        select o.code from qwen_otps o
        where o.address = a.address
        order by o.created_at desc
        limit 1
      ) as code
    from qwen_addresses a
    where a.user_id = ${userId}
    order by a.created_at desc
    limit 20
  `;
  return rows.map((row) => ({
    address: row.address,
    code: row.code,
    createdAt: row.created_at,
  }));
}

export async function readInbox(session: string): Promise<Inbox | Fail> {
  const sql = await getSql();
  const user = await requireUser(sql, session);
  if ("error" in user) return fail(user.error);
  const items = await inboxItems(sql, user.id);
  const latest = items[0];
  return {
    ok: true,
    address: latest?.address ?? null,
    code: latest?.code ?? null,
    items,
  };
}

export async function generateAddress(session: string): Promise<Inbox | Fail> {
  const sql = await getSql();
  const user = await requireUser(sql, session);
  if ("error" in user) return fail(user.error);
  const who = await sql<{ name: string }>`select name from qwen_users where id = ${user.id}`;
  const base =
    (who[0]?.name ?? "qwen")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 10) || "qwen";
  const cap = asNum(await setting(sql, "max_generate")) || 12;
  const countRows = await sql<{ n: number }>`
    select count(*)::int as n from qwen_addresses where user_id = ${user.id}
  `;
  if (asNum(countRows[0]?.n) >= cap) return fail(`Batas generate ${cap} Gmail.`);

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const address = `${base}${randomInt(1000, 10000)}@gmail.com`;
    const taken = await sql<{ id: string }>`select id from qwen_addresses where address = ${address}`;
    if (taken.length > 0) continue;
    await sql`
      insert into qwen_addresses (id, user_id, address)
      values (${crypto.randomUUID()}, ${user.id}, ${address})
    `;
    await logActivity(sql, "gmail", address);
    const items = await inboxItems(sql, user.id);
    return { ok: true, address, code: null, items };
  }
  return fail("Gagal membuat alamat. Coba lagi.");
}

async function adminOk(sql: Sql, session: string) {
  if (!/^[a-f0-9]{64}$/.test(session)) return false;
  const rows = await sql<{ token: string }>`
    select token from qwen_admin_sessions where token = ${session}
  `;
  return rows.length > 0;
}

export async function loginAdmin(input: {
  username: string;
  password: string;
  gmail: string;
  keyword: string;
}): Promise<AdminSession | Fail> {
  const cfg = adminConfig();
  if (!cfg.user || !cfg.pass || !cfg.gmail || !cfg.key) {
    return fail("Login admin belum diatur. Isi ADMIN_USER, ADMIN_PASS, ADMIN_GMAIL, ADMIN_KEY.");
  }
  const usernameOk = safeEqual(input.username.trim(), cfg.user);
  const passwordOk = safeEqual(input.password.trim(), cfg.pass);
  const gmailOk = safeEqual(cleanMail(input.gmail), cfg.gmail);
  const keyOk = safeEqual(input.keyword.trim(), cfg.key);
  if (!usernameOk || !passwordOk || !gmailOk || !keyOk) {
    return fail("Data login Qwen tidak cocok.");
  }
  const sql = await getSql();
  const session = token();
  await sql`insert into qwen_admin_sessions (token) values (${session})`;
  await logActivity(sql, "owner", "Owner masuk");
  return { ok: true, token: session };
}

export async function logoutAdmin(session: string) {
  const sql = await getSql();
  if (/^[a-f0-9]{64}$/.test(session)) {
    await sql`delete from qwen_admin_sessions where token = ${session}`;
  }
  return { ok: true as const };
}

async function studioSettings(sql: Sql): Promise<StudioSettings> {
  const maxRaw = asNum(await setting(sql, "max_generate"));
  return {
    intro: await setting(sql, "video_intro"),
    login: await setting(sql, "video_login"),
    generate: await setting(sql, "video_generate"),
    announcement: await setting(sql, "announcement"),
    maxGenerate: maxRaw > 0 ? maxRaw : 12,
  };
}

export async function publicConfig(): Promise<PublicConfig> {
  const sql = await getSql();
  const settings = await studioSettings(sql);
  return {
    ok: true,
    intro: settings.intro,
    login: settings.login,
    generate: settings.generate,
    announcement: settings.announcement,
  };
}

export async function readAdmin(session: string): Promise<AdminBoard | Fail> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");

  const users = await sql<{
    id: string;
    name: string;
    gmail: string;
    address: string | null;
    address_count: number;
    banned: boolean;
    created_at: string;
  }>`
    select u.id, u.name, u.gmail, u.banned,
      (
        select a.address from qwen_addresses a
        where a.user_id = u.id
        order by a.created_at desc
        limit 1
      ) as address,
      (select count(*)::int from qwen_addresses a where a.user_id = u.id) as address_count,
      to_char(u.created_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI') as created_at
    from qwen_users u
    order by u.created_at desc
    limit 100
  `;

  const boxes = await sql<{
    address: string;
    owner: string;
    owner_gmail: string;
    code: string | null;
    created_at: string;
  }>`
    select a.address, u.name as owner, u.gmail as owner_gmail,
      (
        select o.code from qwen_otps o
        where o.address = a.address
        order by o.created_at desc
        limit 1
      ) as code,
      to_char(a.created_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI') as created_at
    from qwen_addresses a
    join qwen_users u on u.id = a.user_id
    order by a.created_at desc
    limit 100
  `;

  const pending = await sql<{ gmail: string; name: string; code: string }>`
    select gmail, name, code from qwen_reg_otp
    where expires_at > now()
    order by expires_at desc
    limit 50
  `;

  const activity = await sql<{ id: string; kind: string; detail: string; created_at: string }>`
    select id, kind, detail,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI') as created_at
    from qwen_activity
    order by created_at desc
    limit 40
  `;

  const statsRows = await sql<{
    users: number;
    addresses: number;
    otps: number;
    pending: number;
    sessions: number;
  }>`
    select
      (select count(*)::int from qwen_users) as users,
      (select count(*)::int from qwen_addresses) as addresses,
      (select count(*)::int from qwen_otps) as otps,
      (select count(*)::int from qwen_reg_otp where expires_at > now()) as pending,
      (select count(*)::int from qwen_sessions) as sessions
  `;
  const stats = statsRows[0];
  const smtpUser = await setting(sql, "smtp_user");
  const smtpPass = await setting(sql, "smtp_pass");

  return {
    ok: true,
    users: users.map((row) => ({
      id: row.id,
      name: row.name,
      gmail: row.gmail,
      address: row.address,
      addressCount: asNum(row.address_count),
      banned: asBool(row.banned),
      createdAt: row.created_at,
    })),
    boxes: boxes.map((row) => ({
      address: row.address,
      owner: row.owner,
      ownerGmail: row.owner_gmail,
      code: row.code,
      createdAt: row.created_at,
    })),
    pending,
    activity: activity.map((row) => ({
      id: row.id,
      kind: row.kind,
      detail: row.detail,
      createdAt: row.created_at,
    })),
    stats: {
      users: asNum(stats?.users),
      addresses: asNum(stats?.addresses),
      otps: asNum(stats?.otps),
      pending: asNum(stats?.pending),
      sessions: asNum(stats?.sessions),
    },
    smtpReady: Boolean(smtpUser && smtpPass),
    smtpUser,
    settings: await studioSettings(sql),
  };
}

export async function pushCode(session: string, address: string, code: string): Promise<Fail | { ok: true }> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");
  const cleanAddress = cleanMail(address);
  const cleanCode = code.replace(/\s+/g, "");
  if (!isGmail(cleanAddress)) return fail("Alamat harus @gmail.com.");
  if (!/^[A-Za-z0-9]{4,12}$/.test(cleanCode)) return fail("Kode 4–12 huruf atau angka.");
  const found = await sql<{ id: string }>`select id from qwen_addresses where address = ${cleanAddress}`;
  if (found.length === 0) return fail("Alamat itu belum digenerate.");
  await sql`
    insert into qwen_otps (id, address, code)
    values (${crypto.randomUUID()}, ${cleanAddress}, ${cleanCode})
  `;
  await logActivity(sql, "otp", `${cleanAddress} · ${cleanCode}`);
  return { ok: true };
}

export async function removeUserComplete(session: string, userId: string): Promise<Fail | { ok: true }> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return fail("User tidak dikenal.");
  const rows = await sql<{ gmail: string; name: string }>`
    select gmail, name from qwen_users where id = ${userId}
  `;
  const row = rows[0];
  if (!row) return fail("User tidak ada.");
  await sql`delete from qwen_otps where address in (select address from qwen_addresses where user_id = ${userId})`;
  await sql`delete from qwen_sessions where user_id = ${userId}`;
  await sql`delete from qwen_users where id = ${userId}`;
  await sql`delete from qwen_reg_otp where gmail = ${row.gmail}`;
  await logActivity(sql, "hapus", `${row.name} dihapus`);
  return { ok: true };
}

export async function saveSmtp(
  session: string,
  user: string,
  pass: string,
  clear: boolean,
): Promise<Fail | { ok: true }> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");
  if (clear) {
    await putSetting(sql, "smtp_user", "");
    await putSetting(sql, "smtp_pass", "");
    await logActivity(sql, "smtp", "Pengirim diputus");
    return { ok: true };
  }
  const smtpUser = cleanMail(user);
  if (smtpUser && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smtpUser)) return fail("Gmail pengirim tidak valid.");
  if (pass.length > 200) return fail("Sandi aplikasi terlalu panjang.");
  await putSetting(sql, "smtp_user", smtpUser);
  if (pass.trim()) await putSetting(sql, "smtp_pass", pass.trim());
  await logActivity(sql, "smtp", smtpUser ? `Pengirim ${smtpUser}` : "Pengirim dikosongkan");
  return { ok: true };
}

export async function saveStudioSettings(
  session: string,
  input: {
    intro: string;
    login: string;
    generate: string;
    announcement: string;
    maxGenerate: string;
  },
): Promise<Fail | { ok: true }> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");
  const intro = cleanLink(input.intro);
  const login = cleanLink(input.login);
  const generate = cleanLink(input.generate);
  if (intro === null || login === null || generate === null) {
    return fail("Link video harus http(s) atau path /videos/…");
  }
  const announcement = input.announcement.trim().slice(0, 180);
  const maxGenerate = Math.round(asNum(input.maxGenerate));
  if (maxGenerate < 1 || maxGenerate > 50) return fail("Batas generate 1–50.");
  await putSetting(sql, "video_intro", intro);
  await putSetting(sql, "video_login", login);
  await putSetting(sql, "video_generate", generate);
  await putSetting(sql, "announcement", announcement);
  await putSetting(sql, "max_generate", String(maxGenerate));
  await logActivity(sql, "studio", "Pengaturan studio disimpan");
  return { ok: true };
}

export async function setUserBanned(
  session: string,
  userId: string,
  banned: boolean,
): Promise<Fail | { ok: true }> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return fail("User tidak dikenal.");
  const rows = await sql<{ name: string }>`select name from qwen_users where id = ${userId}`;
  if (!rows[0]) return fail("User tidak ada.");
  await sql`update qwen_users set banned = ${banned} where id = ${userId}`;
  if (banned) await sql`delete from qwen_sessions where user_id = ${userId}`;
  await logActivity(sql, "kunci", `${rows[0].name} ${banned ? "dikunci" : "dibuka"}`);
  return { ok: true };
}

export async function forceLogout(session: string, userId: string): Promise<Fail | { ok: true }> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return fail("User tidak dikenal.");
  await sql`delete from qwen_sessions where user_id = ${userId}`;
  await logActivity(sql, "sesi", "Sesi user diputus");
  return { ok: true };
}

export async function revokeAddress(session: string, address: string): Promise<Fail | { ok: true }> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");
  const cleanAddress = cleanMail(address);
  if (!isGmail(cleanAddress)) return fail("Alamat harus @gmail.com.");
  await sql`delete from qwen_otps where address = ${cleanAddress}`;
  await sql`delete from qwen_addresses where address = ${cleanAddress}`;
  await logActivity(sql, "cabut", cleanAddress);
  return { ok: true };
}

export async function clearAddressCode(session: string, address: string): Promise<Fail | { ok: true }> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");
  const cleanAddress = cleanMail(address);
  await sql`delete from qwen_otps where address = ${cleanAddress}`;
  await logActivity(sql, "bersih", `Kode ${cleanAddress} dihapus`);
  return { ok: true };
}

export async function clearAllOtps(session: string): Promise<Fail | { ok: true; deleted: number }> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");
  const result = await sql<{ id: string }>`delete from qwen_otps returning id`;
  await logActivity(sql, "bersih", `${result.length} kode dibersihkan`);
  return { ok: true, deleted: result.length };
}

export async function sendSmtpTest(session: string): Promise<Fail | { ok: true }> {
  const sql = await getSql();
  if (!(await adminOk(sql, session))) return fail("Login Qwen dulu.");
  const smtpUser = await setting(sql, "smtp_user");
  const smtpPass = await setting(sql, "smtp_pass");
  if (!smtpUser || !smtpPass) return fail("Isi Gmail pengirim dan sandi aplikasi dulu.");
  try {
    await sendOtpMail(smtpUser, smtpPass, smtpUser, otpCode(), "Uji kirim QWEN GENERETE");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal kirim.";
    return fail(message.slice(0, 140));
  }
  await logActivity(sql, "smtp", "Uji kirim berhasil");
  return { ok: true };
}

export async function consolePush(keyword: string, address: string, code: string): Promise<Fail | { ok: true }> {
  const adminKey = adminConfig().key;
  if (!adminKey) return fail("Kata kunci admin belum diatur di environment.");
  if (!safeEqual(keyword.trim(), adminKey)) return fail("Kata kunci salah.");
  const sql = await getSql();
  const session = token();
  await sql`insert into qwen_admin_sessions (token) values (${session})`;
  const result = await pushCode(session, address, code);
  await sql`delete from qwen_admin_sessions where token = ${session}`;
  return result;
}
