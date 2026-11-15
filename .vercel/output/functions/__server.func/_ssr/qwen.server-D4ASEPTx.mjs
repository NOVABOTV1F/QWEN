import { randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";
import tls from "node:tls";
//#region node_modules/.nitro/vite/services/ssr/assets/qwen.server-D4ASEPTx.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var _0002_qwen_default = "create table if not exists qwen_users (\n  id text primary key,\n  name text not null,\n  gmail text not null unique,\n  password_hash text not null,\n  password_salt text not null,\n  banned boolean not null default false,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists qwen_reg_otp (\n  gmail text primary key,\n  name text not null,\n  password_hash text not null,\n  password_salt text not null,\n  code text not null,\n  expires_at timestamptz not null\n);\n\ncreate table if not exists qwen_sessions (\n  token text primary key,\n  user_id text not null references qwen_users (id) on delete cascade,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists qwen_admin_sessions (\n  token text primary key,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists qwen_addresses (\n  id text primary key,\n  user_id text not null references qwen_users (id) on delete cascade,\n  address text not null unique,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists qwen_addresses_user_idx on qwen_addresses (user_id, created_at desc);\n\ncreate table if not exists qwen_otps (\n  id text primary key,\n  address text not null,\n  code text not null,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists qwen_otps_address_idx on qwen_otps (address, created_at desc);\n\ncreate table if not exists qwen_settings (\n  key text primary key,\n  value text not null\n);\n\ncreate table if not exists qwen_activity (\n  id text primary key,\n  kind text not null,\n  detail text not null,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists qwen_activity_created_idx on qwen_activity (created_at desc);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_qwen.sql": _0002_qwen_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var qwen_server_exports = /* @__PURE__ */ __exportAll({
	clearAddressCode: () => clearAddressCode,
	clearAllOtps: () => clearAllOtps,
	confirmRegister: () => confirmRegister,
	consolePush: () => consolePush,
	forceLogout: () => forceLogout,
	generateAddress: () => generateAddress,
	issueRegisterOtp: () => issueRegisterOtp,
	loginAdmin: () => loginAdmin,
	loginUser: () => loginUser,
	logoutAdmin: () => logoutAdmin,
	logoutUser: () => logoutUser,
	publicConfig: () => publicConfig,
	pushCode: () => pushCode,
	readAdmin: () => readAdmin,
	readInbox: () => readInbox,
	readSession: () => readSession,
	removeUserComplete: () => removeUserComplete,
	revokeAddress: () => revokeAddress,
	saveSmtp: () => saveSmtp,
	saveStudioSettings: () => saveStudioSettings,
	sendSmtpTest: () => sendSmtpTest,
	setUserBanned: () => setUserBanned
});
var ADMIN_USER = "O1OTOQWEN1";
var ADMIN_PASS = "O5OQWEN01";
var ADMIN_GMAIL = "raran6610@gmail.com";
var ADMIN_KEY = "OWNERQWEN1";
function safeEqual(a, b) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	if (left.length !== right.length) {
		timingSafeEqual(left, left);
		return false;
	}
	return timingSafeEqual(left, right);
}
function hashPassword(password, salt = randomBytes(16).toString("hex")) {
	return {
		hash: scryptSync(password, salt, 32).toString("hex"),
		salt
	};
}
function token() {
	return randomBytes(32).toString("hex");
}
function otpCode() {
	return randomInt(0, 1e6).toString().padStart(6, "0");
}
function fail(error) {
	return {
		ok: false,
		error
	};
}
function asNum(value) {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}
function asBool(value) {
	return value === true || value === "t" || value === "true" || value === 1;
}
function cleanMail(value) {
	return value.trim().toLowerCase();
}
function isGmail(value) {
	return /^[a-z0-9._%+-]+@gmail\.com$/.test(value);
}
function cleanLink(value) {
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
async function setting(sql, key) {
	return (await sql`select value from qwen_settings where key = ${key}`)[0]?.value ?? "";
}
async function putSetting(sql, key, value) {
	await sql`
    insert into qwen_settings (key, value) values (${key}, ${value})
    on conflict (key) do update set value = excluded.value
  `;
}
async function logActivity(sql, kind, detail) {
	await sql`
    insert into qwen_activity (id, kind, detail)
    values (${crypto.randomUUID()}, ${kind}, ${detail.slice(0, 240)})
  `;
}
function sendOtpMail(user, pass, to, code, subject = "Kode OTP QWEN GENERETE") {
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
		"QWEN GENERETE"
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
		"QUIT"
	];
	return new Promise((resolve, reject) => {
		const sock = tls.connect({
			host: "smtp.gmail.com",
			port: 465,
			servername: "smtp.gmail.com"
		});
		let buf = "";
		let step = 0;
		const stop = (error) => {
			sock.destroy();
			reject(error);
		};
		const writeNext = () => {
			const line = queue[step];
			if (line === void 0) return;
			step += 1;
			sock.write(`${line}\r\n`);
		};
		sock.setTimeout(12e3, () => stop(/* @__PURE__ */ new Error("SMTP timeout")));
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
				stop(/* @__PURE__ */ new Error("Gmail menolak kiriman"));
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
async function issueRegisterOtp(input) {
	const sql = await getSql();
	const name = input.name.trim();
	const gmail = cleanMail(input.gmail);
	const password = input.password;
	if (name.length < 1 || name.length > 80) return fail("Isi nama.");
	if (password.length < 8) return fail("Sandi minimal 8 karakter.");
	if (password.length > 200) return fail("Sandi terlalu panjang.");
	if (!isGmail(gmail)) return fail("Pakai alamat Gmail.");
	if ((await sql`select id from qwen_users where gmail = ${gmail}`).length > 0) return fail("Gmail ini sudah terdaftar. Masuk lewat login.");
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
	if (smtpUser && smtpPass) try {
		await sendOtpMail(smtpUser, smtpPass, gmail, code);
		return {
			ok: true,
			delivered: true,
			code: null
		};
	} catch {
		return {
			ok: true,
			delivered: false,
			code
		};
	}
	return {
		ok: true,
		delivered: false,
		code
	};
}
async function confirmRegister(input) {
	const sql = await getSql();
	const gmail = cleanMail(input.gmail);
	const code = input.code.trim();
	const row = (await sql`
    select name, password_hash, password_salt, code
    from qwen_reg_otp
    where gmail = ${gmail} and expires_at > now()
  `)[0];
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
async function loginUser(input) {
	const sql = await getSql();
	const name = input.name.trim();
	const row = (await sql`
    select id, name, gmail, banned from qwen_users
    where gmail = ${cleanMail(input.gmail)} and lower(name) = ${name.toLowerCase()}
  `)[0];
	if (!row) return fail("Nama dan Gmail tidak cocok.");
	if (asBool(row.banned)) return fail("Akun ini dikunci owner.");
	const session = token();
	await sql`insert into qwen_sessions (token, user_id) values (${session}, ${row.id})`;
	await logActivity(sql, "masuk", `${row.name} masuk`);
	return {
		ok: true,
		token: session,
		name: row.name,
		gmail: row.gmail
	};
}
async function userIdFor(sql, session) {
	if (!/^[a-f0-9]{64}$/.test(session)) return null;
	return (await sql`
    select user_id from qwen_sessions where token = ${session}
  `)[0]?.user_id ?? null;
}
async function requireUser(sql, session) {
	const id = await userIdFor(sql, session);
	if (!id) return { error: "Sesi habis. Masuk lagi." };
	const row = (await sql`select banned from qwen_users where id = ${id}`)[0];
	if (!row) return { error: "Sesi habis. Masuk lagi." };
	if (asBool(row.banned)) return { error: "Akun ini dikunci owner." };
	return { id };
}
async function readSession(session) {
	const sql = await getSql();
	const id = await userIdFor(sql, session);
	if (!id) return fail("Sesi habis. Masuk lagi.");
	const row = (await sql`
    select name, gmail, banned from qwen_users where id = ${id}
  `)[0];
	if (!row) return fail("Sesi habis. Masuk lagi.");
	if (asBool(row.banned)) return fail("Akun ini dikunci owner.");
	return {
		ok: true,
		token: session,
		name: row.name,
		gmail: row.gmail
	};
}
async function logoutUser(session) {
	const sql = await getSql();
	if (/^[a-f0-9]{64}$/.test(session)) await sql`delete from qwen_sessions where token = ${session}`;
	return { ok: true };
}
async function inboxItems(sql, userId) {
	return (await sql`
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
  `).map((row) => ({
		address: row.address,
		code: row.code,
		createdAt: row.created_at
	}));
}
async function readInbox(session) {
	const sql = await getSql();
	const user = await requireUser(sql, session);
	if ("error" in user) return fail(user.error);
	const items = await inboxItems(sql, user.id);
	const latest = items[0];
	return {
		ok: true,
		address: latest?.address ?? null,
		code: latest?.code ?? null,
		items
	};
}
async function generateAddress(session) {
	const sql = await getSql();
	const user = await requireUser(sql, session);
	if ("error" in user) return fail(user.error);
	const base = ((await sql`select name from qwen_users where id = ${user.id}`)[0]?.name ?? "qwen").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10) || "qwen";
	const cap = asNum(await setting(sql, "max_generate")) || 12;
	if (asNum((await sql`
    select count(*)::int as n from qwen_addresses where user_id = ${user.id}
  `)[0]?.n) >= cap) return fail(`Batas generate ${cap} Gmail.`);
	for (let attempt = 0; attempt < 6; attempt += 1) {
		const address = `${base}${randomInt(1e3, 1e4)}@gmail.com`;
		if ((await sql`select id from qwen_addresses where address = ${address}`).length > 0) continue;
		await sql`
      insert into qwen_addresses (id, user_id, address)
      values (${crypto.randomUUID()}, ${user.id}, ${address})
    `;
		await logActivity(sql, "gmail", address);
		return {
			ok: true,
			address,
			code: null,
			items: await inboxItems(sql, user.id)
		};
	}
	return fail("Gagal membuat alamat. Coba lagi.");
}
async function adminOk(sql, session) {
	if (!/^[a-f0-9]{64}$/.test(session)) return false;
	return (await sql`
    select token from qwen_admin_sessions where token = ${session}
  `).length > 0;
}
async function loginAdmin(input) {
	const usernameOk = safeEqual(input.username.trim(), ADMIN_USER);
	const passwordOk = safeEqual(input.password.trim(), ADMIN_PASS);
	const gmailOk = safeEqual(cleanMail(input.gmail), ADMIN_GMAIL);
	const keyOk = safeEqual(input.keyword.trim(), ADMIN_KEY);
	if (!usernameOk || !passwordOk || !gmailOk || !keyOk) return fail("Data login Qwen tidak cocok.");
	const sql = await getSql();
	const session = token();
	await sql`insert into qwen_admin_sessions (token) values (${session})`;
	await logActivity(sql, "owner", "Owner masuk");
	return {
		ok: true,
		token: session
	};
}
async function logoutAdmin(session) {
	const sql = await getSql();
	if (/^[a-f0-9]{64}$/.test(session)) await sql`delete from qwen_admin_sessions where token = ${session}`;
	return { ok: true };
}
async function studioSettings(sql) {
	const maxRaw = asNum(await setting(sql, "max_generate"));
	return {
		intro: await setting(sql, "video_intro"),
		login: await setting(sql, "video_login"),
		generate: await setting(sql, "video_generate"),
		announcement: await setting(sql, "announcement"),
		maxGenerate: maxRaw > 0 ? maxRaw : 12
	};
}
async function publicConfig() {
	const settings = await studioSettings(await getSql());
	return {
		ok: true,
		intro: settings.intro,
		login: settings.login,
		generate: settings.generate,
		announcement: settings.announcement
	};
}
async function readAdmin(session) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
	const users = await sql`
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
	const boxes = await sql`
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
	const pending = await sql`
    select gmail, name, code from qwen_reg_otp
    where expires_at > now()
    order by expires_at desc
    limit 50
  `;
	const activity = await sql`
    select id, kind, detail,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI') as created_at
    from qwen_activity
    order by created_at desc
    limit 40
  `;
	const stats = (await sql`
    select
      (select count(*)::int from qwen_users) as users,
      (select count(*)::int from qwen_addresses) as addresses,
      (select count(*)::int from qwen_otps) as otps,
      (select count(*)::int from qwen_reg_otp where expires_at > now()) as pending,
      (select count(*)::int from qwen_sessions) as sessions
  `)[0];
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
			createdAt: row.created_at
		})),
		boxes: boxes.map((row) => ({
			address: row.address,
			owner: row.owner,
			ownerGmail: row.owner_gmail,
			code: row.code,
			createdAt: row.created_at
		})),
		pending,
		activity: activity.map((row) => ({
			id: row.id,
			kind: row.kind,
			detail: row.detail,
			createdAt: row.created_at
		})),
		stats: {
			users: asNum(stats?.users),
			addresses: asNum(stats?.addresses),
			otps: asNum(stats?.otps),
			pending: asNum(stats?.pending),
			sessions: asNum(stats?.sessions)
		},
		smtpReady: Boolean(smtpUser && smtpPass),
		smtpUser,
		settings: await studioSettings(sql)
	};
}
async function pushCode(session, address, code) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
	const cleanAddress = cleanMail(address);
	const cleanCode = code.replace(/\s+/g, "");
	if (!isGmail(cleanAddress)) return fail("Alamat harus @gmail.com.");
	if (!/^[A-Za-z0-9]{4,12}$/.test(cleanCode)) return fail("Kode 4–12 huruf atau angka.");
	if ((await sql`select id from qwen_addresses where address = ${cleanAddress}`).length === 0) return fail("Alamat itu belum digenerate.");
	await sql`
    insert into qwen_otps (id, address, code)
    values (${crypto.randomUUID()}, ${cleanAddress}, ${cleanCode})
  `;
	await logActivity(sql, "otp", `${cleanAddress} · ${cleanCode}`);
	return { ok: true };
}
async function removeUserComplete(session, userId) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
	if (!/^[0-9a-f-]{36}$/i.test(userId)) return fail("User tidak dikenal.");
	const row = (await sql`
    select gmail, name from qwen_users where id = ${userId}
  `)[0];
	if (!row) return fail("User tidak ada.");
	await sql`delete from qwen_otps where address in (select address from qwen_addresses where user_id = ${userId})`;
	await sql`delete from qwen_sessions where user_id = ${userId}`;
	await sql`delete from qwen_users where id = ${userId}`;
	await sql`delete from qwen_reg_otp where gmail = ${row.gmail}`;
	await logActivity(sql, "hapus", `${row.name} dihapus`);
	return { ok: true };
}
async function saveSmtp(session, user, pass, clear) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
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
async function saveStudioSettings(session, input) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
	const intro = cleanLink(input.intro);
	const login = cleanLink(input.login);
	const generate = cleanLink(input.generate);
	if (intro === null || login === null || generate === null) return fail("Link video harus http(s) atau path /videos/…");
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
async function setUserBanned(session, userId, banned) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
	if (!/^[0-9a-f-]{36}$/i.test(userId)) return fail("User tidak dikenal.");
	const rows = await sql`select name from qwen_users where id = ${userId}`;
	if (!rows[0]) return fail("User tidak ada.");
	await sql`update qwen_users set banned = ${banned} where id = ${userId}`;
	if (banned) await sql`delete from qwen_sessions where user_id = ${userId}`;
	await logActivity(sql, "kunci", `${rows[0].name} ${banned ? "dikunci" : "dibuka"}`);
	return { ok: true };
}
async function forceLogout(session, userId) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
	if (!/^[0-9a-f-]{36}$/i.test(userId)) return fail("User tidak dikenal.");
	await sql`delete from qwen_sessions where user_id = ${userId}`;
	await logActivity(sql, "sesi", "Sesi user diputus");
	return { ok: true };
}
async function revokeAddress(session, address) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
	const cleanAddress = cleanMail(address);
	if (!isGmail(cleanAddress)) return fail("Alamat harus @gmail.com.");
	await sql`delete from qwen_otps where address = ${cleanAddress}`;
	await sql`delete from qwen_addresses where address = ${cleanAddress}`;
	await logActivity(sql, "cabut", cleanAddress);
	return { ok: true };
}
async function clearAddressCode(session, address) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
	const cleanAddress = cleanMail(address);
	await sql`delete from qwen_otps where address = ${cleanAddress}`;
	await logActivity(sql, "bersih", `Kode ${cleanAddress} dihapus`);
	return { ok: true };
}
async function clearAllOtps(session) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
	const result = await sql`delete from qwen_otps returning id`;
	await logActivity(sql, "bersih", `${result.length} kode dibersihkan`);
	return {
		ok: true,
		deleted: result.length
	};
}
async function sendSmtpTest(session) {
	const sql = await getSql();
	if (!await adminOk(sql, session)) return fail("Login Qwen dulu.");
	const smtpUser = await setting(sql, "smtp_user");
	const smtpPass = await setting(sql, "smtp_pass");
	if (!smtpUser || !smtpPass) return fail("Isi Gmail pengirim dan sandi aplikasi dulu.");
	try {
		await sendOtpMail(smtpUser, smtpPass, smtpUser, otpCode(), "Uji kirim QWEN GENERETE");
	} catch (err) {
		return fail((err instanceof Error ? err.message : "Gagal kirim.").slice(0, 140));
	}
	await logActivity(sql, "smtp", "Uji kirim berhasil");
	return { ok: true };
}
async function consolePush(keyword, address, code) {
	if (!safeEqual(keyword.trim(), ADMIN_KEY)) return fail("Kata kunci salah.");
	const sql = await getSql();
	const session = token();
	await sql`insert into qwen_admin_sessions (token) values (${session})`;
	const result = await pushCode(session, address, code);
	await sql`delete from qwen_admin_sessions where token = ${session}`;
	return result;
}
//#endregion
export { qwen_server_exports as n, consolePush as t };
