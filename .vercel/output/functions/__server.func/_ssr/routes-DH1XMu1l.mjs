import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as Settings } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DH1XMu1l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function record(input) {
	if (!input || typeof input !== "object") throw new Error("Data tidak lengkap.");
	return input;
}
var sendRegisterOtp = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("850aef8ae4cf0418f27e5d5f209ae4f677668163a90087df4a62b4ed070ff348"));
var finishRegister = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("49b533c280b56dc68399dc9b3485ed00e007a6122be0c3f5ee35bd063c321d5f"));
var enterStudio = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("3f018d5904f3cffae293ab50a0df7a26f7e6247649172ce0b1952faea4e4bc07"));
var currentUser = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("dd6fa6f3ba3ce84476c171de76c2bcbb88d15ad4756cb6b207919c55d1ffe3e6"));
var leaveStudio = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("c576588fe8eee9aa1210fec63bd63f79e8181679481845af1a3fe25c563e5a57"));
var loadInbox = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("1bbe3ef7819965d2bee72289a79662e28fb7764a7cafebdfd9ebc6e38a3a2d76"));
var makeGmail = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("0184a05192a2ac37a674644f44e81c9747bed1fca07a5e3f6c6c5735844c53ec"));
var enterQwen = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("b1f18658a6a9b7e1cc8dbac4887a83ec635bbf8b6f5818335941749d6efe6707"));
var leaveQwen = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("d2ba0760dcd3876f44b9205985c03a7149b8aab3ffbf4911f5dbcfa8d946457c"));
var loadAdmin = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("99f4d3dc37556fea3b1edbd39c6ff440085b4e54732421f32b3cd67a481a0f2b"));
var giveCode = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("3b9116b112b3709b31e834c058fe1dea863a1659a82b30b0ae574e2301052792"));
var dropUser = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("996ccc0010369508ed30c1ec5815ac75888e604e24b57eb3fc65d28814aef13b"));
var storeSmtp = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("f5999162b35af33ffe6fddeb4d487636dcb825fb284ba8add31f8e6f52e8785d"));
var clearOtps = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("226587ca6ee243d88f83499db4313f576b1afbaa4ee5cda9a05a1b696b9136fe"));
var saveStudio = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("6c54271c02098afee932e7e064f02ca803d2680851c91644ead7d7eac9471d6b"));
var setBan = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("7a70546d449cd04470d898fbde16e3ed5b368aa517d3e9de15bf887e5819b226"));
var bootUser = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("02c130bf183fd8618aae687a9f2c41edafe2db5135be1ba4d11d9f614af8daca"));
var revokeBox = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("0265fdb9b3431c0c8c67eef05642a515d4926fc07d034b27a8285c21b79bce93"));
var wipeCode = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("9b607c6d6120d4a0d657be4433e32f5e8fe373d47d7d26cf761913871345cd64"));
var trySmtp = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("6a736fecdb62dbfa72071ec8b3e246e524ca0df78c3d0e6f20bfd138e088047f"));
var loadPublic = createServerFn({ method: "POST" }).validator(record).handler(createSsrRpc("24a750bbf8fb8904249f50770bc78d67b4d05ef269a3546e3b992102668dd04d"));
var USER_TOKEN = "qwen-user";
var ADMIN_TOKEN = "qwen-admin";
var SOUND_KEY = "qwen-sound";
var DEFAULT_LINKS = {
	intro: "/videos/intro.mp4",
	login: "/videos/login.mp4",
	generate: "/videos/generate.mp4"
};
var primary = "press inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-base font-medium text-primary-fg disabled:opacity-50";
var ghost = "press inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-elevated px-5 text-base text-fg disabled:opacity-50";
var input = "h-12 w-full rounded-xl border border-border bg-bg px-4 text-base text-fg outline-none placeholder:text-muted focus-visible:border-fg";
var card = "w-full rounded-4xl border border-border bg-surface p-5";
var tiny = "inline-flex h-11 items-center justify-center rounded-full border border-border px-4 text-sm text-fg disabled:opacity-50";
function roleFor(view) {
	if (view === "login") return "login";
	if (view === "studio") return "generate";
	return "intro";
}
function readError(error) {
	return error instanceof Error && error.message ? error.message : "Gagal. Coba lagi.";
}
async function copyText(value) {
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
function Film({ src, role, sound, videoRef }) {
	const [dead, setDead] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDead(false);
	}, [src]);
	if (!src || dead) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 flex flex-col items-center justify-center bg-surface px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: "Video"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-3xl text-fg italic",
				children: "Siap diputar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xs text-sm text-muted",
				children: "Isi link di file video-links atau lewat TOLS ADMIN."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		ref: videoRef,
		"data-role": role,
		src,
		className: "absolute inset-0 h-full w-full object-cover",
		autoPlay: true,
		loop: true,
		muted: !sound,
		playsInline: true,
		preload: "auto",
		onError: () => setDead(true)
	});
}
function QwenApp() {
	const introRef = (0, import_react.useRef)(null);
	const loginRef = (0, import_react.useRef)(null);
	const generateRef = (0, import_react.useRef)(null);
	const soundRef = (0, import_react.useRef)(false);
	const viewRef = (0, import_react.useRef)("intro");
	const [view, setView] = (0, import_react.useState)("intro");
	const [sound, setSound] = (0, import_react.useState)(false);
	const [links, setLinks] = (0, import_react.useState)(DEFAULT_LINKS);
	const [announcement, setAnnouncement] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [regName, setRegName] = (0, import_react.useState)("");
	const [regPass, setRegPass] = (0, import_react.useState)("");
	const [regGmail, setRegGmail] = (0, import_react.useState)("");
	const [regCode, setRegCode] = (0, import_react.useState)("");
	const [issued, setIssued] = (0, import_react.useState)(null);
	const [mailed, setMailed] = (0, import_react.useState)(false);
	const [awaitingCode, setAwaitingCode] = (0, import_react.useState)(false);
	const [loginName, setLoginName] = (0, import_react.useState)("");
	const [loginGmail, setLoginGmail] = (0, import_react.useState)("");
	const [userToken, setUserToken] = (0, import_react.useState)("");
	const [profile, setProfile] = (0, import_react.useState)({
		name: "",
		gmail: ""
	});
	const [items, setItems] = (0, import_react.useState)([]);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)("");
	const [qwenOpen, setQwenOpen] = (0, import_react.useState)(false);
	const [toolsOpen, setToolsOpen] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("ringkas");
	const [adminToken, setAdminToken] = (0, import_react.useState)("");
	const [board, setBoard] = (0, import_react.useState)(null);
	const [qwenForm, setQwenForm] = (0, import_react.useState)({
		username: "",
		password: "",
		gmail: "",
		keyword: ""
	});
	const [toolError, setToolError] = (0, import_react.useState)("");
	const [toolNote, setToolNote] = (0, import_react.useState)("");
	const [smtpUser, setSmtpUser] = (0, import_react.useState)("");
	const [smtpPass, setSmtpPass] = (0, import_react.useState)("");
	const [studio, setStudio] = (0, import_react.useState)({
		intro: "",
		login: "",
		generate: "",
		announcement: "",
		maxGenerate: "12"
	});
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [quickAddress, setQuickAddress] = (0, import_react.useState)("");
	const [quickCode, setQuickCode] = (0, import_react.useState)("");
	const [accountQuery, setAccountQuery] = (0, import_react.useState)("");
	const [armed, setArmed] = (0, import_react.useState)("");
	const active = items.find((item) => item.address === picked) ?? items[0] ?? null;
	function go(next) {
		viewRef.current = next;
		setView(next);
		setError("");
		setNote("");
	}
	function applyInbox(nextItems, prefer) {
		setItems(nextItems);
		setPicked((prev) => {
			const wanted = prefer ?? prev;
			if (wanted && nextItems.some((item) => item.address === wanted)) return wanted;
			return nextItems[0]?.address ?? null;
		});
	}
	async function reloadLinks() {
		let file = {};
		try {
			const res = await fetch("/video-links.json");
			if (res.ok) file = await res.json();
		} catch {
			file = {};
		}
		try {
			const config = await loadPublic({ data: {} });
			if (config.ok) {
				setAnnouncement(config.announcement);
				const pick = (remote, fromFile, fallback) => remote.trim() || fromFile?.trim() || fallback;
				setLinks({
					intro: pick(config.intro, file.intro, DEFAULT_LINKS.intro),
					login: pick(config.login, file.login, DEFAULT_LINKS.login),
					generate: pick(config.generate, file.generate, DEFAULT_LINKS.generate)
				});
				return;
			}
		} catch {}
		setLinks({
			intro: file.intro?.trim() || DEFAULT_LINKS.intro,
			login: file.login?.trim() || DEFAULT_LINKS.login,
			generate: file.generate?.trim() || DEFAULT_LINKS.generate
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
	(0, import_react.useEffect)(() => {
		viewRef.current = view;
	}, [view]);
	(0, import_react.useEffect)(() => {
		if (sessionStorage.getItem(SOUND_KEY) === "1") {
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
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key !== "Escape") return;
			setQwenOpen(false);
			setToolsOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	(0, import_react.useEffect)(() => {
		reloadLinks();
	}, []);
	(0, import_react.useEffect)(() => {
		const role = roleFor(view);
		const nodes = [
			introRef.current,
			loginRef.current,
			generateRef.current
		];
		for (const el of nodes) {
			if (!el) continue;
			if (el.dataset.role !== role) {
				el.pause();
				continue;
			}
			el.muted = !sound;
			el.play().catch(() => {
				el.muted = true;
				el.play().catch(() => void 0);
			});
		}
	}, [
		view,
		sound,
		links.intro,
		links.login,
		links.generate
	]);
	(0, import_react.useEffect)(() => {
		const token = localStorage.getItem(USER_TOKEN) ?? "";
		const admin = localStorage.getItem(ADMIN_TOKEN) ?? "";
		if (admin) setAdminToken(admin);
		if (!token) return;
		currentUser({ data: { token } }).then((res) => {
			if (!res.ok) {
				localStorage.removeItem(USER_TOKEN);
				return;
			}
			setUserToken(token);
			setProfile({
				name: res.name,
				gmail: res.gmail
			});
			viewRef.current = "studio";
			setView("studio");
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!userToken || view !== "studio") return;
		let stop = false;
		const pull = () => {
			if (document.hidden) return;
			loadInbox({ data: { token: userToken } }).then((res) => {
				if (stop || !res.ok) return;
				applyInbox(res.items);
			});
		};
		pull();
		const timer = window.setInterval(pull, 3e3);
		return () => {
			stop = true;
			window.clearInterval(timer);
		};
	}, [userToken, view]);
	(0, import_react.useEffect)(() => {
		if (!adminToken || !toolsOpen) return;
		refreshBoard();
	}, [adminToken, toolsOpen]);
	async function onRegister(event) {
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
			const res = await sendRegisterOtp({ data: {
				name: regName,
				password: regPass,
				gmail: regGmail
			} });
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
	async function onConfirm(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		try {
			const res = await finishRegister({ data: {
				gmail: regGmail,
				code: regCode
			} });
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
	async function onLogin(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		try {
			const res = await enterStudio({ data: {
				name: loginName,
				gmail: loginGmail
			} });
			if (!res.ok) {
				setError(res.error);
				return;
			}
			localStorage.setItem(USER_TOKEN, res.token);
			setUserToken(res.token);
			setProfile({
				name: res.name,
				gmail: res.gmail
			});
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
		if (token) leaveStudio({ data: { token } });
	}
	async function onQwen(event) {
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
			setQwenForm({
				username: "",
				password: "",
				gmail: "",
				keyword: ""
			});
			setToolNote("Owner masuk. Tombol TOLS ADMIN ada di kiri atas.");
		} catch (cause) {
			setToolError(readError(cause));
		} finally {
			setBusy(false);
		}
	}
	async function onPush(addressKey, code) {
		setToolError("");
		setToolNote("");
		const res = await giveCode({ data: {
			token: adminToken,
			address: addressKey,
			code
		} });
		if (!res.ok) {
			setToolError(res.error);
			return;
		}
		setDrafts((prev) => ({
			...prev,
			[addressKey]: ""
		}));
		setQuickAddress("");
		setQuickCode("");
		setToolNote("Kode masuk ke kotak user.");
		await refreshBoard();
		await pullInbox();
	}
	async function onDrop(userId) {
		const res = await dropUser({ data: {
			token: adminToken,
			userId
		} });
		if (!res.ok) {
			setToolError(res.error);
			return;
		}
		setArmed("");
		setToolNote("Akun dihapus.");
		await refreshBoard();
	}
	async function onSmtp(event) {
		event.preventDefault();
		const res = await storeSmtp({ data: {
			token: adminToken,
			user: smtpUser,
			pass: smtpPass,
			clear: ""
		} });
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
		if (token) leaveQwen({ data: { token } });
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
				maxGenerate: String(board.settings.maxGenerate)
			});
			setSmtpUser(board.smtpUser);
		}
	}
	const shownUsers = (board?.users ?? []).filter((user) => {
		const query = accountQuery.trim().toLowerCase();
		if (!query) return true;
		return user.name.toLowerCase().includes(query) || user.gmail.toLowerCase().includes(query) || (user.address ?? "").toLowerCase().includes(query);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh overflow-x-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between gap-3 px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-auto",
					children: adminToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: tiny,
						onClick: openTools,
						children: "TOLS ADMIN"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: "QWEN GENERETE"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Login Qwen",
					className: "press pointer-events-auto grid size-12 place-items-center rounded-full border border-border bg-surface text-fg",
					onClick: () => {
						setToolError("");
						setQwenOpen(true);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
						className: "size-5",
						"aria-hidden": "true"
					})
				})]
			}),
			view === "intro" || view === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative min-h-dvh bg-bg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {
						src: links.intro,
						role: "intro",
						sound,
						videoRef: introRef
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg/55" }),
					view === "intro" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-widest text-muted uppercase",
								children: "Gmail on"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 max-w-full font-display text-5xl text-fg italic sm:text-7xl",
								children: "QWEN GENERETE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-sm text-base text-fg",
								children: "Daftar, masuk, ambil Gmail, terima kode OTP."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex w-full max-w-xs flex-col gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: primary,
									onClick: () => go("login"),
									children: "LOGIN"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: ghost,
									onClick: () => go("register"),
									children: "Registrasi"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-8 text-sm text-muted",
								children: sound ? "Suara video menyala" : "Ketuk di mana saja — suara video menyala"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-10 flex min-h-dvh items-center justify-center px-4 py-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: `${card} rise max-w-md`,
							noValidate: true,
							onSubmit: awaitingCode ? onConfirm : onRegister,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-11 text-sm text-muted",
									onClick: () => go("intro"),
									children: "Kembali"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 font-display text-4xl text-fg italic",
									children: "Registrasi"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-5 block text-sm text-muted",
									htmlFor: "reg-name",
									children: "Nama"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "reg-name",
									className: `${input} mt-2`,
									value: regName,
									onChange: (event) => setRegName(event.target.value),
									autoComplete: "name",
									readOnly: awaitingCode,
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-4 block text-sm text-muted",
									htmlFor: "reg-pass",
									children: "Pass"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "reg-pass",
									className: `${input} pass-ink mt-2`,
									value: regPass,
									onChange: (event) => setRegPass(event.target.value),
									type: "text",
									autoComplete: "new-password",
									spellCheck: false,
									autoCapitalize: "off",
									minLength: 8,
									placeholder: "minimal 8 karakter",
									readOnly: awaitingCode,
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-muted",
									children: [
										"Teks sandi tembus, tetap terbaca.",
										" ",
										regPass.length < 8 ? `Masih ${8 - regPass.length} karakter.` : "Sandi cukup."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-4 block text-sm text-muted",
									htmlFor: "reg-gmail",
									children: "Gmail on"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "reg-gmail",
									className: `${input} mt-2`,
									value: regGmail,
									onChange: (event) => setRegGmail(event.target.value),
									type: "email",
									inputMode: "email",
									autoComplete: "email",
									autoCapitalize: "off",
									spellCheck: false,
									placeholder: "nama@gmail.com",
									readOnly: awaitingCode,
									required: true
								}),
								awaitingCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 rounded-xl border border-border bg-bg p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted",
												children: mailed && !issued ? `Kode OTP dikirim ke ${regGmail}.` : `Kode untuk ${regGmail || "Gmail kamu"}`
											}),
											issued ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 font-display text-4xl text-fg tabular-nums",
												children: issued
											}) : null,
											!mailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-sm text-muted",
												children: "Pengirim belum tersambung, jadi kode tampil di sini. Sambungkan nanti di TOLS ADMIN."
											}) : null
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mt-4 block text-sm text-muted",
										htmlFor: "reg-otp",
										children: "Kode OTP"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "reg-otp",
										className: `${input} mt-2 tabular-nums`,
										value: regCode,
										onChange: (event) => setRegCode(event.target.value),
										inputMode: "numeric",
										autoComplete: "one-time-code",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "mt-3 h-11 text-sm text-muted",
										onClick: () => {
											setAwaitingCode(false);
											setIssued(null);
											setRegCode("");
										},
										children: "Ubah data"
									})
								] }) : null,
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-fg",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `${primary} mt-5`,
									type: "submit",
									disabled: busy,
									children: busy ? "Menunggu…" : awaitingCode ? "Selesai" : "Kirim kode OTP"
								})
							]
						})
					})
				]
			}) : null,
			view === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-5 px-4 py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center font-display text-3xl text-fg italic",
						children: "QWEN GENERETE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative aspect-video overflow-hidden rounded-4xl border border-border bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {
							src: links.login,
							role: "login",
							sound,
							videoRef: loginRef
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: `${card} rise`,
						onSubmit: onLogin,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 text-sm text-muted",
								onClick: () => go("intro"),
								children: "Kembali"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-4xl text-fg italic",
								children: "Login"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-5 block text-sm text-muted",
								htmlFor: "login-name",
								children: "Nama"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "login-name",
								className: `${input} mt-2`,
								value: loginName,
								onChange: (event) => setLoginName(event.target.value),
								autoComplete: "username",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-4 block text-sm text-muted",
								htmlFor: "login-gmail",
								children: "Gmail"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "login-gmail",
								className: `${input} mt-2`,
								value: loginGmail,
								onChange: (event) => setLoginGmail(event.target.value),
								type: "email",
								inputMode: "email",
								autoComplete: "email",
								autoCapitalize: "off",
								spellCheck: false,
								required: true
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-fg",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `${primary} mt-5`,
								type: "submit",
								disabled: busy,
								children: busy ? "Masuk…" : "Login"
							})
						]
					})
				]
			}) : null,
			view === "studio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: ["Masuk sebagai ", profile.name || "…"]
					}),
					announcement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg",
						children: announcement
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative aspect-video overflow-hidden rounded-4xl border border-border bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {
							src: links.generate,
							role: "generate",
							sound,
							videoRef: generateRef
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-4xl text-fg italic",
						children: "Generete Gmail"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: primary,
						onClick: () => void onGenerate(),
						disabled: busy || !userToken,
						children: busy ? "Membuat…" : "Generete"
					}),
					active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "min-w-0 flex-1 text-base break-all",
							children: active.address
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: tiny,
							onClick: () => {
								copyText(active.address).then((ok) => setCopied(ok ? active.address : ""));
							},
							children: copied === active.address ? "Tersalin" : "Salin"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Gmail muncul di bawah setelah kamu menekan Generete."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-live": "polite",
						className: "grid min-h-28 place-items-center rounded-xl border border-dashed border-border bg-bg px-4 text-center",
						children: active?.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-4xl text-fg tabular-nums",
							children: active.code
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 h-11 text-sm text-muted",
							onClick: () => {
								if (active.code) copyText(active.code).then((ok) => setCopied(ok ? active.code ?? "" : ""));
							},
							children: active.code && copied === active.code ? "Kode tersalin" : "Salin kode"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Kotak kosong. Kode OTP masuk ke sini kalau sudah selesai dipakai."
						})
					}),
					items.filter((item) => item.address !== active?.address).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Gmail lain"
						}), items.filter((item) => item.address !== active?.address).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "h-11 truncate rounded-xl border border-border px-3 text-left text-sm text-muted",
							onClick: () => setPicked(item.address),
							children: [item.address, item.code ? " · ada kode" : ""]
						}, item.address))]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: ghost,
						onClick: () => void onCheck(),
						disabled: busy || !userToken,
						children: "Cek kode OTP"
					}),
					note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: note
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 text-sm text-muted",
						onClick: () => void onLeave(),
						children: "Keluar"
					})
				]
			}) : null,
			toolNote && !toolsOpen && !qwenOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "fixed inset-x-4 bottom-4 z-30 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg",
				children: toolNote
			}) : null,
			qwenOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 grid place-items-center bg-bg/80 px-4",
				role: "presentation",
				onClick: () => setQwenOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "qwen-title",
					className: `${card} rise max-h-[90dvh] max-w-md overflow-y-auto`,
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "qwen-title",
							className: "font-display text-3xl text-fg italic",
							children: "Login Qwen"
						}),
						adminToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "Sesi owner aktif. Halaman yang sedang terbuka tidak berubah."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: primary,
									onClick: () => {
										setQwenOpen(false);
										openTools();
									},
									children: "Buka TOLS ADMIN"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: ghost,
									onClick: () => void onAdminOut(),
									children: "Keluar login Qwen"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: onQwen,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-4 block text-sm text-muted",
									htmlFor: "qwen-user",
									children: "Username"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "qwen-user",
									className: `${input} mt-2`,
									value: qwenForm.username,
									onChange: (event) => setQwenForm({
										...qwenForm,
										username: event.target.value
									}),
									autoComplete: "username",
									autoCapitalize: "off",
									spellCheck: false,
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-3 block text-sm text-muted",
									htmlFor: "qwen-pass",
									children: "Pass"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "qwen-pass",
									className: `${input} mt-2`,
									value: qwenForm.password,
									onChange: (event) => setQwenForm({
										...qwenForm,
										password: event.target.value
									}),
									type: "password",
									autoComplete: "current-password",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-3 block text-sm text-muted",
									htmlFor: "qwen-gmail",
									children: "Gmail"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "qwen-gmail",
									className: `${input} mt-2`,
									value: qwenForm.gmail,
									onChange: (event) => setQwenForm({
										...qwenForm,
										gmail: event.target.value
									}),
									type: "email",
									autoComplete: "email",
									autoCapitalize: "off",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-3 block text-sm text-muted",
									htmlFor: "qwen-key",
									children: "Kata kunci"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "qwen-key",
									className: `${input} mt-2`,
									value: qwenForm.keyword,
									onChange: (event) => setQwenForm({
										...qwenForm,
										keyword: event.target.value
									}),
									type: "password",
									autoComplete: "off",
									required: true
								}),
								toolError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-fg",
									children: toolError
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `${primary} mt-5`,
									type: "submit",
									disabled: busy,
									children: "Masuk"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-3 h-11 w-full text-sm text-muted",
							onClick: () => setQwenOpen(false),
							children: "Tutup"
						})
					]
				})
			}) : null,
			toolsOpen && adminToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 overflow-y-auto bg-bg px-4 py-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-lg flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-4xl text-fg italic",
								children: "TOLS ADMIN"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: tiny,
								onClick: () => setToolsOpen(false),
								children: "Tutup"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 overflow-x-auto pb-1",
							children: [
								["ringkas", "Ringkas"],
								["akun", "Akun"],
								["otp", "OTP"],
								["video", "Video"],
								["kirim", "Kirim"],
								["log", "Log"]
							].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: id === tab ? `${tiny} bg-primary text-primary-fg` : tiny,
								onClick: () => setTab(id),
								children: label
							}, id))
						}),
						toolError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: toolError
						}) : null,
						toolNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: toolNote
						}) : null,
						tab === "ringkas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: card,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-medium",
									children: "Ringkasan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 grid grid-cols-2 gap-3",
									children: [
										["Akun", board?.stats.users ?? 0],
										["Gmail", board?.stats.addresses ?? 0],
										["Kode", board?.stats.otps ?? 0],
										["Sesi", board?.stats.sessions ?? 0]
									].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-bg px-3 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted",
											children: label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-3xl text-fg tabular-nums",
											children: value
										})]
									}, label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 text-sm text-muted",
									children: [
										"OTP registrasi menunggu: ",
										board?.stats.pending ?? 0,
										". Pengirim:",
										" ",
										board?.smtpReady ? "tersambung" : "belum",
										"."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-5 text-base font-medium",
									children: "OTP registrasi"
								}),
								board && board.pending.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 flex flex-col gap-3",
									children: board.pending.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: row.name }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted break-all",
												children: row.gmail
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-fg tabular-nums",
												children: row.code
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "mt-1 h-11 text-sm text-muted",
												onClick: () => void copyText(row.code).then(() => setToolNote("Kode registrasi tersalin.")),
												children: "Salin kode"
											})
										]
									}, row.gmail))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: "Tidak ada."
								})
							]
						}) : null,
						tab === "akun" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: card,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-medium",
										children: "Akun"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: tiny,
										onClick: () => {
											copyText((board?.users ?? []).map((user) => `${user.name}\t${user.gmail}\t${user.address ?? ""}`).join("\n")).then((ok) => setToolNote(ok ? "Daftar akun tersalin." : "Gagal menyalin."));
										},
										children: "Salin semua"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-3 block text-sm text-muted",
									htmlFor: "find-user",
									children: "Cari"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "find-user",
									className: `${input} mt-2`,
									value: accountQuery,
									onChange: (event) => setAccountQuery(event.target.value),
									placeholder: "nama atau gmail"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-4 flex flex-col gap-4",
									children: [shownUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "border-t border-border pt-4 text-sm first:border-0 first:pt-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [user.name, user.banned ? " · terkunci" : ""] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted break-all",
												children: user.gmail
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-muted break-all",
												children: [
													user.address ?? "belum generate",
													" · ",
													user.addressCount,
													" gmail · ",
													user.createdAt
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex flex-wrap gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: tiny,
														onClick: () => {
															setBan({ data: {
																token: adminToken,
																userId: user.id,
																banned: user.banned ? "0" : "1"
															} }).then(async (res) => {
																if (!res.ok) {
																	setToolError(res.error);
																	return;
																}
																setToolNote(user.banned ? "Akun dibuka." : "Akun dikunci.");
																await refreshBoard();
															});
														},
														children: user.banned ? "Buka" : "Kunci"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: tiny,
														onClick: () => {
															bootUser({ data: {
																token: adminToken,
																userId: user.id
															} }).then(async (res) => {
																if (!res.ok) {
																	setToolError(res.error);
																	return;
																}
																setToolNote("Sesi user diputus.");
																await refreshBoard();
															});
														},
														children: "Putus sesi"
													}),
													armed === user.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: tiny,
														onClick: () => void onDrop(user.id),
														children: "Ya, hapus"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: tiny,
														onClick: () => setArmed(""),
														children: "Batal"
													})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: tiny,
														onClick: () => setArmed(user.id),
														children: "Hapus"
													})
												]
											})
										]
									}, user.id)), shownUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-sm text-muted",
										children: "Tidak ada akun."
									}) : null]
								})
							]
						}) : null,
						tab === "otp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: card,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-medium",
									children: "Dorong kode OTP"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "User memakai Gmail generate, lalu kamu tempel kodenya. Kotak user terisi sendiri."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-4 block text-sm text-muted",
									htmlFor: "quick-mail",
									children: "Gmail generate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "quick-mail",
									className: `${input} mt-2`,
									value: quickAddress,
									onChange: (event) => setQuickAddress(event.target.value),
									placeholder: "nama1234@gmail.com",
									autoCapitalize: "off",
									spellCheck: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-3 block text-sm text-muted",
									htmlFor: "quick-code",
									children: "Kode"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "quick-code",
									className: `${input} mt-2 tabular-nums`,
									value: quickCode,
									onChange: (event) => setQuickCode(event.target.value),
									placeholder: "kode",
									autoComplete: "off"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: `${primary} mt-3`,
									onClick: () => void onPush(quickAddress, quickCode),
									children: "Kirim ke kotak"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: tiny,
										onClick: () => {
											clearOtps({ data: { token: adminToken } }).then(async (res) => {
												if (!res.ok) {
													setToolError(res.error);
													return;
												}
												setToolNote(`${res.deleted} kode dibersihkan.`);
												await refreshBoard();
												await pullInbox();
											});
										},
										children: "Bersihkan semua kode"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-5 flex flex-col gap-4",
									children: [board?.boxes.map((box) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "border-t border-border pt-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm",
												children: box.owner
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted break-all",
												children: box.address
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-fg tabular-nums",
												children: box.code ?? "belum ada kode"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted",
												children: box.createdAt
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: `${input} tabular-nums`,
													value: drafts[box.address] ?? "",
													onChange: (event) => setDrafts((prev) => ({
														...prev,
														[box.address]: event.target.value
													})),
													placeholder: "kode",
													autoComplete: "off"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "h-12 shrink-0 rounded-full bg-primary px-4 text-sm font-medium text-primary-fg",
													onClick: () => void onPush(box.address, drafts[box.address] ?? ""),
													children: "Kirim"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex flex-wrap gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: tiny,
													onClick: () => {
														wipeCode({ data: {
															token: adminToken,
															address: box.address
														} }).then(async (res) => {
															if (!res.ok) {
																setToolError(res.error);
																return;
															}
															setToolNote("Kode kotak dihapus.");
															await refreshBoard();
															await pullInbox();
														});
													},
													children: "Hapus kode"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: tiny,
													onClick: () => {
														revokeBox({ data: {
															token: adminToken,
															address: box.address
														} }).then(async (res) => {
															if (!res.ok) {
																setToolError(res.error);
																return;
															}
															setToolNote("Gmail dicabut.");
															await refreshBoard();
															await pullInbox();
														});
													},
													children: "Cabut Gmail"
												})]
											})
										]
									}, box.address)), board && board.boxes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-sm text-muted",
										children: "Belum ada Gmail."
									}) : null]
								})
							]
						}) : null,
						tab === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: card,
							onSubmit: (event) => {
								event.preventDefault();
								saveStudio({ data: {
									token: adminToken,
									intro: studio.intro,
									login: studio.login,
									generate: studio.generate,
									announcement: studio.announcement,
									maxGenerate: studio.maxGenerate
								} }).then(async (res) => {
									if (!res.ok) {
										setToolError(res.error);
										return;
									}
									setToolError("");
									setToolNote("Video dan pengumuman disimpan.");
									const next = await refreshBoard();
									if (next) setStudio({
										intro: next.settings.intro,
										login: next.settings.login,
										generate: next.settings.generate,
										announcement: next.settings.announcement,
										maxGenerate: String(next.settings.maxGenerate)
									});
									await reloadLinks();
								});
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-medium",
									children: "Link video"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "File khusus tetap `video-links.json`. Kalau diisi di sini, link admin yang dipakai. Kosongkan untuk kembali ke file."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-4 block text-sm text-muted",
									htmlFor: "vid-intro",
									children: "Video 1 · layar penuh"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "vid-intro",
									className: `${input} mt-2`,
									value: studio.intro,
									onChange: (event) => setStudio((prev) => ({
										...prev,
										intro: event.target.value
									})),
									placeholder: "/videos/intro.mp4",
									autoCapitalize: "off",
									spellCheck: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-3 block text-sm text-muted",
									htmlFor: "vid-login",
									children: "Video 2 · atas login"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "vid-login",
									className: `${input} mt-2`,
									value: studio.login,
									onChange: (event) => setStudio((prev) => ({
										...prev,
										login: event.target.value
									})),
									placeholder: "/videos/login.mp4",
									autoCapitalize: "off",
									spellCheck: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-3 block text-sm text-muted",
									htmlFor: "vid-gen",
									children: "Video 3 · atas Generete Gmail"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "vid-gen",
									className: `${input} mt-2`,
									value: studio.generate,
									onChange: (event) => setStudio((prev) => ({
										...prev,
										generate: event.target.value
									})),
									placeholder: "/videos/generate.mp4",
									autoCapitalize: "off",
									spellCheck: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-3 block text-sm text-muted",
									htmlFor: "announce",
									children: "Pengumuman ke user"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "announce",
									className: `${input} mt-2`,
									value: studio.announcement,
									onChange: (event) => setStudio((prev) => ({
										...prev,
										announcement: event.target.value
									})),
									maxLength: 180
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-3 block text-sm text-muted",
									htmlFor: "cap",
									children: "Batas generate per akun"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "cap",
									className: `${input} mt-2 tabular-nums`,
									value: studio.maxGenerate,
									onChange: (event) => setStudio((prev) => ({
										...prev,
										maxGenerate: event.target.value
									})),
									inputMode: "numeric"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `${primary} mt-4`,
									type: "submit",
									children: "Simpan studio"
								})
							]
						}) : null,
						tab === "kirim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: card,
							onSubmit: onSmtp,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-medium",
									children: "Pengirim OTP ke Gmail"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted",
									children: [
										"Isi Gmail pengirim dan sandi aplikasi Google. Kode registrasi lalu terkirim ke Gmail user. Status: ",
										board?.smtpReady ? "tersambung" : "belum",
										"."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: `${input} mt-3`,
									value: smtpUser,
									onChange: (event) => setSmtpUser(event.target.value),
									type: "email",
									placeholder: "pengirim@gmail.com",
									autoComplete: "off"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: `${input} mt-3`,
									value: smtpPass,
									onChange: (event) => setSmtpPass(event.target.value),
									type: "password",
									placeholder: "sandi aplikasi",
									autoComplete: "new-password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `${primary} mt-3`,
									type: "submit",
									children: "Simpan pengirim"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: ghost,
										onClick: () => {
											trySmtp({ data: { token: adminToken } }).then((res) => {
												if (!res.ok) {
													setToolError(res.error);
													setToolNote("");
													return;
												}
												setToolError("");
												setToolNote("Uji kirim berhasil. Cek kotak pengirim.");
											});
										},
										children: "Uji kirim"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: ghost,
										onClick: () => {
											storeSmtp({ data: {
												token: adminToken,
												user: "",
												pass: "",
												clear: "1"
											} }).then(async (res) => {
												if (!res.ok) {
													setToolError(res.error);
													return;
												}
												setSmtpUser("");
												setSmtpPass("");
												setToolNote("Pengirim diputus.");
												await refreshBoard();
											});
										},
										children: "Putuskan"
									})]
								})
							]
						}) : null,
						tab === "log" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: card,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-medium",
								children: "Jejak"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 flex flex-col gap-3",
								children: [board?.activity.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted",
										children: [
											row.createdAt,
											" · ",
											row.kind
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "break-all",
										children: row.detail
									})]
								}, row.id)), board && board.activity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-sm text-muted",
									children: "Belum ada jejak."
								}) : null]
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: ghost,
							onClick: () => void onAdminOut(),
							children: "Keluar login Qwen"
						})
					]
				})
			}) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QwenApp, {});
}
//#endregion
export { Home as component };
