import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { Settings } from "lucide-react";
import {
  bootUser,
  clearOtps,
  currentUser,
  dropUser,
  enterQwen,
  enterStudio,
  finishRegister,
  giveCode,
  leaveQwen,
  leaveStudio,
  loadAdmin,
  loadInbox,
  loadPublic,
  makeGmail,
  revokeBox,
  saveStudio,
  sendRegisterOtp,
  setBan,
  storeSmtp,
  trySmtp,
  wipeCode,
} from "@/lib/qwen.functions";
import type { AdminBoard, InboxItem } from "@/lib/qwen-types";

type View = "intro" | "register" | "login" | "studio";
type Role = "intro" | "login" | "generate";
type Links = { intro: string; login: string; generate: string };
type Tab = "ringkas" | "akun" | "otp" | "video" | "kirim" | "log";
type StudioForm = {
  intro: string;
  login: string;
  generate: string;
  announcement: string;
  maxGenerate: string;
};

const USER_TOKEN = "qwen-user";
const ADMIN_TOKEN = "qwen-admin";
const SOUND_KEY = "qwen-sound";

const DEFAULT_LINKS: Links = {
  intro: "/videos/intro.mp4",
  login: "/videos/login.mp4",
  generate: "/videos/generate.mp4",
};

const primary =
  "press inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-base font-medium text-primary-fg disabled:opacity-50";
const ghost =
  "press inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-elevated px-5 text-base text-fg disabled:opacity-50";
const input =
  "h-12 w-full rounded-xl border border-border bg-bg px-4 text-base text-fg outline-none placeholder:text-muted focus-visible:border-fg";
const card = "w-full rounded-4xl border border-border bg-surface p-5";
const tiny = "inline-flex h-11 items-center justify-center rounded-full border border-border px-4 text-sm text-fg disabled:opacity-50";

function roleFor(view: View): Role {
  if (view === "login") return "login";
  if (view === "studio") return "generate";
  return "intro";
}

function readError(error: unknown) {
  return error instanceof Error && error.message ? error.message : "Gagal. Coba lagi.";
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "true");
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function Film({
  src,
  role,
  sound,
  videoRef,
}: {
  src: string;
  role: Role;
  sound: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const [dead, setDead] = useState(false);
  useEffect(() => {
    setDead(false);
  }, [src]);

  if (!src || dead) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface px-6 text-center">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Video</p>
        <p className="mt-2 font-display text-3xl text-fg italic">Siap diputar</p>
        <p className="mt-2 max-w-xs text-sm text-muted">Isi link di file video-links atau lewat TOLS ADMIN.</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      data-role={role}
      src={src}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      loop
      muted={!sound}
      playsInline
      preload="auto"
      onError={() => setDead(true)}
    />
  );
}

export function QwenApp() {
  const introRef = useRef<HTMLVideoElement>(null);
  const loginRef = useRef<HTMLVideoElement>(null);
  const generateRef = useRef<HTMLVideoElement>(null);
  const soundRef = useRef(false);
  const viewRef = useRef<View>("intro");

  const [view, setView] = useState<View>("intro");
  const [sound, setSound] = useState(false);
  const [links, setLinks] = useState<Links>(DEFAULT_LINKS);
  const [announcement, setAnnouncement] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const [regName, setRegName] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regGmail, setRegGmail] = useState("");
  const [regCode, setRegCode] = useState("");
  const [issued, setIssued] = useState<string | null>(null);
  const [mailed, setMailed] = useState(false);
  const [awaitingCode, setAwaitingCode] = useState(false);

  const [loginName, setLoginName] = useState("");
  const [loginGmail, setLoginGmail] = useState("");
  const [userToken, setUserToken] = useState("");
  const [profile, setProfile] = useState({ name: "", gmail: "" });
  const [items, setItems] = useState<InboxItem[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [copied, setCopied] = useState("");

  const [qwenOpen, setQwenOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("ringkas");
  const [adminToken, setAdminToken] = useState("");
  const [board, setBoard] = useState<AdminBoard | null>(null);
  const [qwenForm, setQwenForm] = useState({ username: "", password: "", gmail: "", keyword: "" });
  const [toolError, setToolError] = useState("");
  const [toolNote, setToolNote] = useState("");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [studio, setStudio] = useState<StudioForm>({
    intro: "",
    login: "",
    generate: "",
    announcement: "",
    maxGenerate: "12",
  });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [quickAddress, setQuickAddress] = useState("");
  const [quickCode, setQuickCode] = useState("");
  const [accountQuery, setAccountQuery] = useState("");
  const [armed, setArmed] = useState("");

  const active = items.find((item) => item.address === picked) ?? items[0] ?? null;

  function go(next: View) {
    viewRef.current = next;
    setView(next);
    setError("");
    setNote("");
  }

  function applyInbox(nextItems: InboxItem[], prefer?: string | null) {
    setItems(nextItems);
    setPicked((prev) => {
      const wanted = prefer ?? prev;
      if (wanted && nextItems.some((item) => item.address === wanted)) return wanted;
      return nextItems[0]?.address ?? null;
    });
  }

  async function reloadLinks() {
    let file: Partial<Links> = {};
    try {
      const res = await fetch("/video-links.json");
      if (res.ok) file = (await res.json()) as Partial<Links>;
    } catch {
      file = {};
    }
    try {
      const config = await loadPublic({ data: {} });
      if (config.ok) {
        setAnnouncement(config.announcement);
        const pick = (remote: string, fromFile: string | undefined, fallback: string) =>
          remote.trim() || fromFile?.trim() || fallback;
        setLinks({
          intro: pick(config.intro, file.intro, DEFAULT_LINKS.intro),
          login: pick(config.login, file.login, DEFAULT_LINKS.login),
          generate: pick(config.generate, file.generate, DEFAULT_LINKS.generate),
        });
        return;
      }
    } catch {
      // File links still apply below.
    }
    setLinks({
      intro: file.intro?.trim() || DEFAULT_LINKS.intro,
      login: file.login?.trim() || DEFAULT_LINKS.login,
      generate: file.generate?.trim() || DEFAULT_LINKS.generate,
    });
  }

  async function refreshBoard() {
    if (!adminToken) return null;
    const res = await loadAdmin({ data: { token: adminToken } });
    if (!res.ok) {
      localStorage.removeItem(ADMIN_TOKEN);
      setAdminToken("");
      setBoard(null);
      return null;
    }
    setBoard(res);
    setSmtpUser(res.smtpUser);
    return res;
  }

  async function pullInbox(token = userToken) {
    if (!token) return;
    const res = await loadInbox({ data: { token } });
    if (!res.ok) return;
    applyInbox(res.items);
  }

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    const remembered = sessionStorage.getItem(SOUND_KEY) === "1";
    if (remembered) {
      soundRef.current = true;
      setSound(true);
    }
    const arm = () => {
      soundRef.current = true;
      sessionStorage.setItem(SOUND_KEY, "1");
      setSound(true);
    };
    window.addEventListener("pointerdown", arm);
    return () => window.removeEventListener("pointerdown", arm);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setQwenOpen(false);
      setToolsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    void reloadLinks();
    // Links load once; admin save calls reloadLinks again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const role = roleFor(view);
    const nodes = [introRef.current, loginRef.current, generateRef.current];
    for (const el of nodes) {
      if (!el) continue;
      if (el.dataset.role !== role) {
        el.pause();
        continue;
      }
      el.muted = !sound;
      void el.play().catch(() => {
        el.muted = true;
        void el.play().catch(() => undefined);
      });
    }
  }, [view, sound, links.intro, links.login, links.generate]);

  useEffect(() => {
    const token = localStorage.getItem(USER_TOKEN) ?? "";
    const admin = localStorage.getItem(ADMIN_TOKEN) ?? "";
    if (admin) setAdminToken(admin);
    if (!token) return;
    void currentUser({ data: { token } }).then((res) => {
      if (!res.ok) {
        localStorage.removeItem(USER_TOKEN);
        return;
      }
      setUserToken(token);
      setProfile({ name: res.name, gmail: res.gmail });
      viewRef.current = "studio";
      setView("studio");
    });
  }, []);

  useEffect(() => {
    if (!userToken || view !== "studio") return;
    let stop = false;
    let lastKey = "";
    // One poll in flight at a time: a slow DB reply (several seconds) must not
    // overlap the next poll, or the older reply lands last and flips the code.
    let inFlight = false;
    const pull = () => {
      if (document.hidden || inFlight) return;
      inFlight = true;
      loadInbox({ data: { token: userToken } })
        .then((res) => {
          if (stop || !res.ok) return;
          // Only re-render when the inbox really changed, so the code doesn't flicker every poll.
          const key = JSON.stringify(res.items);
          if (key === lastKey) return;
          lastKey = key;
          applyInbox(res.items);
        })
        .catch(() => undefined)
        .finally(() => {
          inFlight = false;
        });
    };
    pull();
    const timer = window.setInterval(pull, 3000);
    return () => {
      stop = true;
      window.clearInterval(timer);
    };
  }, [userToken, view]);

  useEffect(() => {
    if (!adminToken || !toolsOpen) return;
    void refreshBoard();
    // Refresh when the owner opens tools.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, toolsOpen]);

  async function onRegister(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (regName.trim().length < 1) {
      setError("Isi nama.");
      return;
    }
    if (regPass.length < 8) {
      setError("Sandi minimal 8 karakter.");
      return;
    }
    setBusy(true);
    try {
      const res = await sendRegisterOtp({
        data: { name: regName, password: regPass, gmail: regGmail },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setIssued(res.code);
      setMailed(res.delivered);
      setAwaitingCode(true);
    } catch (cause) {
      setError(readError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function onConfirm(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await finishRegister({ data: { gmail: regGmail, code: regCode } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setLoginName(regName.trim());
      setLoginGmail(regGmail.trim());
      setAwaitingCode(false);
      setRegCode("");
      go("login");
    } catch (cause) {
      setError(readError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await enterStudio({ data: { name: loginName, gmail: loginGmail } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      localStorage.setItem(USER_TOKEN, res.token);
      setUserToken(res.token);
      setProfile({ name: res.name, gmail: res.gmail });
      go("studio");
    } catch (cause) {
      setError(readError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function onGenerate() {
    setBusy(true);
    setError("");
    setNote("");
    try {
      const res = await makeGmail({ data: { token: userToken } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      applyInbox(res.items, res.address);
      setCopied("");
      setNote("Gmail siap dipakai. Selesaikan misi, lalu kembali ke kotak ini.");
    } catch (cause) {
      setError(readError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function onCheck() {
    setBusy(true);
    setError("");
    try {
      const res = await loadInbox({ data: { token: userToken } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      applyInbox(res.items, picked);
      const current = res.items.find((item) => item.address === (picked ?? res.address));
      setNote(current?.code ? "Kode OTP sudah masuk." : "Belum ada kode. Kotak tetap menunggu.");
    } catch (cause) {
      setError(readError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function onLeave() {
    const token = userToken;
    localStorage.removeItem(USER_TOKEN);
    setUserToken("");
    setItems([]);
    setPicked(null);
    go("intro");
    if (token) void leaveStudio({ data: { token } });
  }

  async function onQwen(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setToolError("");
    try {
      const res = await enterQwen({ data: qwenForm });
      if (!res.ok) {
        setToolError(res.error);
        return;
      }
      localStorage.setItem(ADMIN_TOKEN, res.token);
      setAdminToken(res.token);
      setQwenOpen(false);
      setQwenForm({ username: "", password: "", gmail: "", keyword: "" });
      setToolNote("Owner masuk. Tombol TOLS ADMIN ada di kiri atas.");
    } catch (cause) {
      setToolError(readError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function onPush(addressKey: string, code: string) {
    setToolError("");
    setToolNote("");
    const res = await giveCode({ data: { token: adminToken, address: addressKey, code } });
    if (!res.ok) {
      setToolError(res.error);
      return;
    }
    setDrafts((prev) => ({ ...prev, [addressKey]: "" }));
    setQuickAddress("");
    setQuickCode("");
    setToolNote("Kode masuk ke kotak user.");
    await refreshBoard();
    await pullInbox();
  }

  async function onDrop(userId: string) {
    const res = await dropUser({ data: { token: adminToken, userId } });
    if (!res.ok) {
      setToolError(res.error);
      return;
    }
    setArmed("");
    setToolNote("Akun dihapus.");
    await refreshBoard();
  }

  async function onSmtp(event: FormEvent) {
    event.preventDefault();
    const res = await storeSmtp({ data: { token: adminToken, user: smtpUser, pass: smtpPass, clear: "" } });
    if (!res.ok) {
      setToolError(res.error);
      return;
    }
    setSmtpPass("");
    setToolError("");
    setToolNote("Pengirim disimpan.");
    await refreshBoard();
  }

  async function onAdminOut() {
    const token = adminToken;
    localStorage.removeItem(ADMIN_TOKEN);
    setAdminToken("");
    setBoard(null);
    setToolsOpen(false);
    setQwenOpen(false);
    if (token) void leaveQwen({ data: { token } });
  }

  function openTools() {
    setToolError("");
    setTab("ringkas");
    setToolsOpen(true);
    if (board) {
      setStudio({
        intro: board.settings.intro,
        login: board.settings.login,
        generate: board.settings.generate,
        announcement: board.settings.announcement,
        maxGenerate: String(board.settings.maxGenerate),
      });
      setSmtpUser(board.smtpUser);
    }
  }

  const shownUsers = (board?.users ?? []).filter((user) => {
    const query = accountQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      user.name.toLowerCase().includes(query) ||
      user.gmail.toLowerCase().includes(query) ||
      (user.address ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-dvh overflow-x-hidden bg-bg text-fg">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between gap-3 px-4 pt-4">
        <div className="pointer-events-auto">
          {adminToken ? (
            <button type="button" className={tiny} onClick={openTools}>
              TOLS ADMIN
            </button>
          ) : (
            <span className="sr-only">QWEN GENERETE</span>
          )}
        </div>
        <button
          type="button"
          aria-label="Login Qwen"
          className="press pointer-events-auto grid size-12 place-items-center rounded-full border border-border bg-surface text-fg"
          onClick={() => {
            setToolError("");
            setQwenOpen(true);
          }}
        >
          <Settings className="size-5" aria-hidden="true" />
        </button>
      </div>

      {view === "intro" || view === "register" ? (
        <section className="relative min-h-dvh bg-bg">
          <Film src={links.intro} role="intro" sound={sound} videoRef={introRef} />
          <div className="absolute inset-0 bg-bg/55" />
          {view === "intro" ? (
            <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
              <p className="text-xs font-medium tracking-widest text-muted uppercase">Gmail on</p>
              <h1 className="mt-3 max-w-full font-display text-5xl text-fg italic sm:text-7xl">QWEN GENERETE</h1>
              <p className="mt-4 max-w-sm text-base text-fg">Daftar, masuk, ambil Gmail, terima kode OTP.</p>
              <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
                <button type="button" className={primary} onClick={() => go("login")}>
                  LOGIN
                </button>
                <button type="button" className={ghost} onClick={() => go("register")}>
                  Registrasi
                </button>
              </div>
              <p className="mt-8 text-sm text-muted">
                {sound ? "Suara video menyala" : "Ketuk di mana saja — suara video menyala"}
              </p>
            </div>
          ) : (
            <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-24">
              <form className={`${card} rise max-w-md`} noValidate onSubmit={awaitingCode ? onConfirm : onRegister}>
                <button type="button" className="h-11 text-sm text-muted" onClick={() => go("intro")}>
                  Kembali
                </button>
                <h2 className="mt-1 font-display text-4xl text-fg italic">Registrasi</h2>
                <label className="mt-5 block text-sm text-muted" htmlFor="reg-name">
                  Nama
                </label>
                <input
                  id="reg-name"
                  className={`${input} mt-2`}
                  value={regName}
                  onChange={(event) => setRegName(event.target.value)}
                  autoComplete="name"
                  readOnly={awaitingCode}
                  required
                />
                <label className="mt-4 block text-sm text-muted" htmlFor="reg-pass">
                  Pass
                </label>
                <input
                  id="reg-pass"
                  className={`${input} pass-ink mt-2`}
                  value={regPass}
                  onChange={(event) => setRegPass(event.target.value)}
                  type="text"
                  autoComplete="new-password"
                  spellCheck={false}
                  autoCapitalize="off"
                  minLength={8}
                  placeholder="minimal 8 karakter"
                  readOnly={awaitingCode}
                  required
                />
                <p className="mt-2 text-sm text-muted">
                  Teks sandi tembus, tetap terbaca.{" "}
                  {regPass.length < 8 ? `Masih ${8 - regPass.length} karakter.` : "Sandi cukup."}
                </p>
                <label className="mt-4 block text-sm text-muted" htmlFor="reg-gmail">
                  Gmail on
                </label>
                <input
                  id="reg-gmail"
                  className={`${input} mt-2`}
                  value={regGmail}
                  onChange={(event) => setRegGmail(event.target.value)}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="nama@gmail.com"
                  readOnly={awaitingCode}
                  required
                />
                {awaitingCode ? (
                  <>
                    <div className="mt-5 rounded-xl border border-border bg-bg p-4">
                      <p className="text-sm text-muted">
                        {mailed && !issued
                          ? `Kode OTP dikirim ke ${regGmail}.`
                          : `Kode untuk ${regGmail || "Gmail kamu"}`}
                      </p>
                      {issued ? <p className="mt-2 font-display text-4xl text-fg tabular-nums">{issued}</p> : null}
                      {!mailed ? (
                        <p className="mt-2 text-sm text-muted">
                          Pengirim belum tersambung, jadi kode tampil di sini. Sambungkan nanti di TOLS ADMIN.
                        </p>
                      ) : null}
                    </div>
                    <label className="mt-4 block text-sm text-muted" htmlFor="reg-otp">
                      Kode OTP
                    </label>
                    <input
                      id="reg-otp"
                      className={`${input} mt-2 tabular-nums`}
                      value={regCode}
                      onChange={(event) => setRegCode(event.target.value)}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                    />
                    <button
                      type="button"
                      className="mt-3 h-11 text-sm text-muted"
                      onClick={() => {
                        setAwaitingCode(false);
                        setIssued(null);
                        setRegCode("");
                      }}
                    >
                      Ubah data
                    </button>
                  </>
                ) : null}
                {error ? <p className="mt-3 text-sm text-fg">{error}</p> : null}
                <button className={`${primary} mt-5`} type="submit" disabled={busy}>
                  {busy ? "Menunggu…" : awaitingCode ? "Selesai" : "Kirim kode OTP"}
                </button>
              </form>
            </div>
          )}
        </section>
      ) : null}

      {view === "login" ? (
        <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-5 px-4 py-24">
          <p className="text-center font-display text-3xl text-fg italic">QWEN GENERETE</p>
          <div className="relative aspect-video overflow-hidden rounded-4xl border border-border bg-surface">
            <Film src={links.login} role="login" sound={sound} videoRef={loginRef} />
          </div>
          <form className={`${card} rise`} onSubmit={onLogin}>
            <button type="button" className="h-11 text-sm text-muted" onClick={() => go("intro")}>
              Kembali
            </button>
            <h2 className="mt-1 font-display text-4xl text-fg italic">Login</h2>
            <label className="mt-5 block text-sm text-muted" htmlFor="login-name">
              Nama
            </label>
            <input
              id="login-name"
              className={`${input} mt-2`}
              value={loginName}
              onChange={(event) => setLoginName(event.target.value)}
              autoComplete="username"
              required
            />
            <label className="mt-4 block text-sm text-muted" htmlFor="login-gmail">
              Gmail
            </label>
            <input
              id="login-gmail"
              className={`${input} mt-2`}
              value={loginGmail}
              onChange={(event) => setLoginGmail(event.target.value)}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              spellCheck={false}
              required
            />
            {error ? <p className="mt-3 text-sm text-fg">{error}</p> : null}
            <button className={`${primary} mt-5`} type="submit" disabled={busy}>
              {busy ? "Masuk…" : "Login"}
            </button>
          </form>
        </section>
      ) : null}

      {view === "studio" ? (
        <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 py-24">
          <p className="text-sm text-muted">Masuk sebagai {profile.name || "…"}</p>
          {announcement ? (
            <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg">{announcement}</p>
          ) : null}
          <div className="relative aspect-video overflow-hidden rounded-4xl border border-border bg-surface">
            <Film src={links.generate} role="generate" sound={sound} videoRef={generateRef} />
          </div>
          <h2 className="font-display text-4xl text-fg italic">Generete Gmail</h2>
          <button type="button" className={primary} onClick={() => void onGenerate()} disabled={busy || !userToken}>
            {busy ? "Membuat…" : "Generete"}
          </button>
          {active ? (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
              <p className="min-w-0 flex-1 text-base break-all">{active.address}</p>
              <button
                type="button"
                className={tiny}
                onClick={() => {
                  void copyText(active.address).then((ok) => setCopied(ok ? active.address : ""));
                }}
              >
                {copied === active.address ? "Tersalin" : "Salin"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted">Gmail muncul di bawah setelah kamu menekan Generete.</p>
          )}
          <div
            aria-live="polite"
            className="grid min-h-28 place-items-center rounded-xl border border-dashed border-border bg-bg px-4 text-center"
          >
            {active?.code ? (
              <div>
                <p className="font-display text-4xl text-fg tabular-nums">{active.code}</p>
                <button
                  type="button"
                  className="mt-2 h-11 text-sm text-muted"
                  onClick={() => {
                    if (active.code) void copyText(active.code).then((ok) => setCopied(ok ? active.code ?? "" : ""));
                  }}
                >
                  {active.code && copied === active.code ? "Kode tersalin" : "Salin kode"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted">Kotak kosong. Kode OTP masuk ke sini kalau sudah selesai dipakai.</p>
            )}
          </div>
          {items.filter((item) => item.address !== active?.address).length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted">Gmail lain</p>
              {items
                .filter((item) => item.address !== active?.address)
                .map((item) => (
                  <button
                    key={item.address}
                    type="button"
                    className="h-11 truncate rounded-xl border border-border px-3 text-left text-sm text-muted"
                    onClick={() => setPicked(item.address)}
                  >
                    {item.address}
                    {item.code ? " · ada kode" : ""}
                  </button>
                ))}
            </div>
          ) : null}
          <button type="button" className={ghost} onClick={() => void onCheck()} disabled={busy || !userToken}>
            Cek kode OTP
          </button>
          {note ? <p className="text-sm text-muted">{note}</p> : null}
          {error ? <p className="text-sm text-fg">{error}</p> : null}
          <button type="button" className="h-11 text-sm text-muted" onClick={() => void onLeave()}>
            Keluar
          </button>
        </section>
      ) : null}

      {toolNote && !toolsOpen && !qwenOpen ? (
        <p className="fixed inset-x-4 bottom-4 z-30 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg">
          {toolNote}
        </p>
      ) : null}

      {qwenOpen ? (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-bg/80 px-4"
          role="presentation"
          onClick={() => setQwenOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qwen-title"
            className={`${card} rise max-h-[90dvh] max-w-md overflow-y-auto`}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="qwen-title" className="font-display text-3xl text-fg italic">
              Login Qwen
            </h2>
            {adminToken ? (
              <div className="mt-4 flex flex-col gap-3">
                <p className="text-sm text-muted">Sesi owner aktif. Halaman yang sedang terbuka tidak berubah.</p>
                <button
                  type="button"
                  className={primary}
                  onClick={() => {
                    setQwenOpen(false);
                    openTools();
                  }}
                >
                  Buka TOLS ADMIN
                </button>
                <button type="button" className={ghost} onClick={() => void onAdminOut()}>
                  Keluar login Qwen
                </button>
              </div>
            ) : (
              <form onSubmit={onQwen}>
                <label className="mt-4 block text-sm text-muted" htmlFor="qwen-user">
                  Username
                </label>
                <input
                  id="qwen-user"
                  className={`${input} mt-2`}
                  value={qwenForm.username}
                  onChange={(event) => setQwenForm({ ...qwenForm, username: event.target.value })}
                  autoComplete="username"
                  autoCapitalize="off"
                  spellCheck={false}
                  required
                />
                <label className="mt-3 block text-sm text-muted" htmlFor="qwen-pass">
                  Pass
                </label>
                <input
                  id="qwen-pass"
                  className={`${input} mt-2`}
                  value={qwenForm.password}
                  onChange={(event) => setQwenForm({ ...qwenForm, password: event.target.value })}
                  type="password"
                  autoComplete="current-password"
                  required
                />
                <label className="mt-3 block text-sm text-muted" htmlFor="qwen-gmail">
                  Gmail
                </label>
                <input
                  id="qwen-gmail"
                  className={`${input} mt-2`}
                  value={qwenForm.gmail}
                  onChange={(event) => setQwenForm({ ...qwenForm, gmail: event.target.value })}
                  type="email"
                  autoComplete="email"
                  autoCapitalize="off"
                  required
                />
                <label className="mt-3 block text-sm text-muted" htmlFor="qwen-key">
                  Kata kunci
                </label>
                <input
                  id="qwen-key"
                  className={`${input} mt-2`}
                  value={qwenForm.keyword}
                  onChange={(event) => setQwenForm({ ...qwenForm, keyword: event.target.value })}
                  type="password"
                  autoComplete="off"
                  required
                />
                {toolError ? <p className="mt-3 text-sm text-fg">{toolError}</p> : null}
                <button className={`${primary} mt-5`} type="submit" disabled={busy}>
                  Masuk
                </button>
              </form>
            )}
            <button type="button" className="mt-3 h-11 w-full text-sm text-muted" onClick={() => setQwenOpen(false)}>
              Tutup
            </button>
          </div>
        </div>
      ) : null}

      {toolsOpen && adminToken ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-bg px-4 py-6">
          <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-4xl text-fg italic">TOLS ADMIN</h2>
              <button type="button" className={tiny} onClick={() => setToolsOpen(false)}>
                Tutup
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(
                [
                  ["ringkas", "Ringkas"],
                  ["akun", "Akun"],
                  ["otp", "OTP"],
                  ["video", "Video"],
                  ["kirim", "Kirim"],
                  ["log", "Log"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={id === tab ? `${tiny} bg-primary text-primary-fg` : tiny}
                  onClick={() => setTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            {toolError ? <p className="text-sm text-fg">{toolError}</p> : null}
            {toolNote ? <p className="text-sm text-muted">{toolNote}</p> : null}

            {tab === "ringkas" ? (
              <section className={card}>
                <h3 className="text-base font-medium">Ringkasan</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {(
                    [
                      ["Akun", board?.stats.users ?? 0],
                      ["Gmail", board?.stats.addresses ?? 0],
                      ["Kode", board?.stats.otps ?? 0],
                      ["Sesi", board?.stats.sessions ?? 0],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-border bg-bg px-3 py-3">
                      <p className="text-sm text-muted">{label}</p>
                      <p className="font-display text-3xl text-fg tabular-nums">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted">
                  OTP registrasi menunggu: {board?.stats.pending ?? 0}. Pengirim:{" "}
                  {board?.smtpReady ? "tersambung" : "belum"}.
                </p>
                <h3 className="mt-5 text-base font-medium">OTP registrasi</h3>
                {board && board.pending.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-3">
                    {board.pending.map((row) => (
                      <li key={row.gmail} className="text-sm">
                        <p>{row.name}</p>
                        <p className="text-muted break-all">{row.gmail}</p>
                        <p className="text-fg tabular-nums">{row.code}</p>
                        <button
                          type="button"
                          className="mt-1 h-11 text-sm text-muted"
                          onClick={() => void copyText(row.code).then(() => setToolNote("Kode registrasi tersalin."))}
                        >
                          Salin kode
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted">Tidak ada.</p>
                )}
              </section>
            ) : null}

            {tab === "akun" ? (
              <section className={card}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-medium">Akun</h3>
                  <button
                    type="button"
                    className={tiny}
                    onClick={() => {
                      const text = (board?.users ?? [])
                        .map((user) => `${user.name}\t${user.gmail}\t${user.address ?? ""}`)
                        .join("\n");
                      void copyText(text).then((ok) => setToolNote(ok ? "Daftar akun tersalin." : "Gagal menyalin."));
                    }}
                  >
                    Salin semua
                  </button>
                </div>
                <label className="mt-3 block text-sm text-muted" htmlFor="find-user">
                  Cari
                </label>
                <input
                  id="find-user"
                  className={`${input} mt-2`}
                  value={accountQuery}
                  onChange={(event) => setAccountQuery(event.target.value)}
                  placeholder="nama atau gmail"
                />
                <ul className="mt-4 flex flex-col gap-4">
                  {shownUsers.map((user) => (
                    <li key={user.id} className="border-t border-border pt-4 text-sm first:border-0 first:pt-0">
                      <p>
                        {user.name}
                        {user.banned ? " · terkunci" : ""}
                      </p>
                      <p className="text-muted break-all">{user.gmail}</p>
                      <p className="text-muted break-all">
                        {user.address ?? "belum generate"} · {user.addressCount} gmail · {user.createdAt}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={tiny}
                          onClick={() => {
                            void setBan({
                              data: { token: adminToken, userId: user.id, banned: user.banned ? "0" : "1" },
                            }).then(async (res) => {
                              if (!res.ok) {
                                setToolError(res.error);
                                return;
                              }
                              setToolNote(user.banned ? "Akun dibuka." : "Akun dikunci.");
                              await refreshBoard();
                            });
                          }}
                        >
                          {user.banned ? "Buka" : "Kunci"}
                        </button>
                        <button
                          type="button"
                          className={tiny}
                          onClick={() => {
                            void bootUser({ data: { token: adminToken, userId: user.id } }).then(async (res) => {
                              if (!res.ok) {
                                setToolError(res.error);
                                return;
                              }
                              setToolNote("Sesi user diputus.");
                              await refreshBoard();
                            });
                          }}
                        >
                          Putus sesi
                        </button>
                        {armed === user.id ? (
                          <>
                            <button type="button" className={tiny} onClick={() => void onDrop(user.id)}>
                              Ya, hapus
                            </button>
                            <button type="button" className={tiny} onClick={() => setArmed("")}>
                              Batal
                            </button>
                          </>
                        ) : (
                          <button type="button" className={tiny} onClick={() => setArmed(user.id)}>
                            Hapus
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                  {shownUsers.length === 0 ? <li className="text-sm text-muted">Tidak ada akun.</li> : null}
                </ul>
              </section>
            ) : null}

            {tab === "otp" ? (
              <section className={card}>
                <h3 className="text-base font-medium">Dorong kode OTP</h3>
                <p className="mt-1 text-sm text-muted">
                  User memakai Gmail generate, lalu kamu tempel kodenya. Kotak user terisi sendiri.
                </p>
                <label className="mt-4 block text-sm text-muted" htmlFor="quick-mail">
                  Gmail generate
                </label>
                <input
                  id="quick-mail"
                  className={`${input} mt-2`}
                  value={quickAddress}
                  onChange={(event) => setQuickAddress(event.target.value)}
                  placeholder="nama1234@gmail.com"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <label className="mt-3 block text-sm text-muted" htmlFor="quick-code">
                  Kode
                </label>
                <input
                  id="quick-code"
                  className={`${input} mt-2 tabular-nums`}
                  value={quickCode}
                  onChange={(event) => setQuickCode(event.target.value)}
                  placeholder="kode"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className={`${primary} mt-3`}
                  onClick={() => void onPush(quickAddress, quickCode)}
                >
                  Kirim ke kotak
                </button>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className={tiny}
                    onClick={() => {
                      void clearOtps({ data: { token: adminToken } }).then(async (res) => {
                        if (!res.ok) {
                          setToolError(res.error);
                          return;
                        }
                        setToolNote(`${res.deleted} kode dibersihkan.`);
                        await refreshBoard();
                        await pullInbox();
                      });
                    }}
                  >
                    Bersihkan semua kode
                  </button>
                </div>
                <ul className="mt-5 flex flex-col gap-4">
                  {board?.boxes.map((box) => (
                    <li key={box.address} className="border-t border-border pt-4">
                      <p className="text-sm">{box.owner}</p>
                      <p className="text-sm text-muted break-all">{box.address}</p>
                      <p className="text-sm text-fg tabular-nums">{box.code ?? "belum ada kode"}</p>
                      <p className="text-sm text-muted">{box.createdAt}</p>
                      <div className="mt-2 flex gap-2">
                        <input
                          className={`${input} tabular-nums`}
                          value={drafts[box.address] ?? ""}
                          onChange={(event) =>
                            setDrafts((prev) => ({ ...prev, [box.address]: event.target.value }))
                          }
                          placeholder="kode"
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          className="h-12 shrink-0 rounded-full bg-primary px-4 text-sm font-medium text-primary-fg"
                          onClick={() => void onPush(box.address, drafts[box.address] ?? "")}
                        >
                          Kirim
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={tiny}
                          onClick={() => {
                            void wipeCode({ data: { token: adminToken, address: box.address } }).then(async (res) => {
                              if (!res.ok) {
                                setToolError(res.error);
                                return;
                              }
                              setToolNote("Kode kotak dihapus.");
                              await refreshBoard();
                              await pullInbox();
                            });
                          }}
                        >
                          Hapus kode
                        </button>
                        <button
                          type="button"
                          className={tiny}
                          onClick={() => {
                            void revokeBox({ data: { token: adminToken, address: box.address } }).then(async (res) => {
                              if (!res.ok) {
                                setToolError(res.error);
                                return;
                              }
                              setToolNote("Gmail dicabut.");
                              await refreshBoard();
                              await pullInbox();
                            });
                          }}
                        >
                          Cabut Gmail
                        </button>
                      </div>
                    </li>
                  ))}
                  {board && board.boxes.length === 0 ? <li className="text-sm text-muted">Belum ada Gmail.</li> : null}
                </ul>
              </section>
            ) : null}

            {tab === "video" ? (
              <form
                className={card}
                onSubmit={(event) => {
                  event.preventDefault();
                  void saveStudio({
                    data: {
                      token: adminToken,
                      intro: studio.intro,
                      login: studio.login,
                      generate: studio.generate,
                      announcement: studio.announcement,
                      maxGenerate: studio.maxGenerate,
                    },
                  }).then(async (res) => {
                    if (!res.ok) {
                      setToolError(res.error);
                      return;
                    }
                    setToolError("");
                    setToolNote("Video dan pengumuman disimpan.");
                    const next = await refreshBoard();
                    if (next) {
                      setStudio({
                        intro: next.settings.intro,
                        login: next.settings.login,
                        generate: next.settings.generate,
                        announcement: next.settings.announcement,
                        maxGenerate: String(next.settings.maxGenerate),
                      });
                    }
                    await reloadLinks();
                  });
                }}
              >
                <h3 className="text-base font-medium">Link video</h3>
                <p className="mt-1 text-sm text-muted">
                  File khusus tetap `video-links.json`. Kalau diisi di sini, link admin yang dipakai. Kosongkan
                  untuk kembali ke file.
                </p>
                <label className="mt-4 block text-sm text-muted" htmlFor="vid-intro">
                  Video 1 · layar penuh
                </label>
                <input
                  id="vid-intro"
                  className={`${input} mt-2`}
                  value={studio.intro}
                  onChange={(event) => setStudio((prev) => ({ ...prev, intro: event.target.value }))}
                  placeholder="/videos/intro.mp4"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <label className="mt-3 block text-sm text-muted" htmlFor="vid-login">
                  Video 2 · atas login
                </label>
                <input
                  id="vid-login"
                  className={`${input} mt-2`}
                  value={studio.login}
                  onChange={(event) => setStudio((prev) => ({ ...prev, login: event.target.value }))}
                  placeholder="/videos/login.mp4"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <label className="mt-3 block text-sm text-muted" htmlFor="vid-gen">
                  Video 3 · atas Generete Gmail
                </label>
                <input
                  id="vid-gen"
                  className={`${input} mt-2`}
                  value={studio.generate}
                  onChange={(event) => setStudio((prev) => ({ ...prev, generate: event.target.value }))}
                  placeholder="/videos/generate.mp4"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <label className="mt-3 block text-sm text-muted" htmlFor="announce">
                  Pengumuman ke user
                </label>
                <input
                  id="announce"
                  className={`${input} mt-2`}
                  value={studio.announcement}
                  onChange={(event) => setStudio((prev) => ({ ...prev, announcement: event.target.value }))}
                  maxLength={180}
                />
                <label className="mt-3 block text-sm text-muted" htmlFor="cap">
                  Batas generate per akun
                </label>
                <input
                  id="cap"
                  className={`${input} mt-2 tabular-nums`}
                  value={studio.maxGenerate}
                  onChange={(event) => setStudio((prev) => ({ ...prev, maxGenerate: event.target.value }))}
                  inputMode="numeric"
                />
                <button className={`${primary} mt-4`} type="submit">
                  Simpan studio
                </button>
              </form>
            ) : null}

            {tab === "kirim" ? (
              <form className={card} onSubmit={onSmtp}>
                <h3 className="text-base font-medium">Pengirim OTP ke Gmail</h3>
                <p className="mt-1 text-sm text-muted">
                  Isi Gmail pengirim dan sandi aplikasi Google. Kode registrasi lalu terkirim ke Gmail user.
                  Status: {board?.smtpReady ? "tersambung" : "belum"}.
                </p>
                <input
                  className={`${input} mt-3`}
                  value={smtpUser}
                  onChange={(event) => setSmtpUser(event.target.value)}
                  type="email"
                  placeholder="pengirim@gmail.com"
                  autoComplete="off"
                />
                <input
                  className={`${input} mt-3`}
                  value={smtpPass}
                  onChange={(event) => setSmtpPass(event.target.value)}
                  type="password"
                  placeholder="sandi aplikasi"
                  autoComplete="new-password"
                />
                <button className={`${primary} mt-3`} type="submit">
                  Simpan pengirim
                </button>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    className={ghost}
                    onClick={() => {
                      void trySmtp({ data: { token: adminToken } }).then((res) => {
                        if (!res.ok) {
                          setToolError(res.error);
                          setToolNote("");
                          return;
                        }
                        setToolError("");
                        setToolNote("Uji kirim berhasil. Cek kotak pengirim.");
                      });
                    }}
                  >
                    Uji kirim
                  </button>
                  <button
                    type="button"
                    className={ghost}
                    onClick={() => {
                      void storeSmtp({ data: { token: adminToken, user: "", pass: "", clear: "1" } }).then(
                        async (res) => {
                          if (!res.ok) {
                            setToolError(res.error);
                            return;
                          }
                          setSmtpUser("");
                          setSmtpPass("");
                          setToolNote("Pengirim diputus.");
                          await refreshBoard();
                        },
                      );
                    }}
                  >
                    Putuskan
                  </button>
                </div>
              </form>
            ) : null}

            {tab === "log" ? (
              <section className={card}>
                <h3 className="text-base font-medium">Jejak</h3>
                <ul className="mt-3 flex flex-col gap-3">
                  {board?.activity.map((row) => (
                    <li key={row.id} className="text-sm">
                      <p className="text-muted">
                        {row.createdAt} · {row.kind}
                      </p>
                      <p className="break-all">{row.detail}</p>
                    </li>
                  ))}
                  {board && board.activity.length === 0 ? <li className="text-sm text-muted">Belum ada jejak.</li> : null}
                </ul>
              </section>
            ) : null}

            <button type="button" className={ghost} onClick={() => void onAdminOut()}>
              Keluar login Qwen
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
