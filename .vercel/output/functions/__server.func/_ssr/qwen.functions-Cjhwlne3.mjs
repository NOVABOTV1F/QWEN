import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/qwen.functions-Cjhwlne3.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function record(input) {
	if (!input || typeof input !== "object") throw new Error("Data tidak lengkap.");
	return input;
}
function text(source, key) {
	const value = source[key];
	return typeof value === "string" ? value : "";
}
var sendRegisterOtp_createServerFn_handler = createServerRpc({
	id: "850aef8ae4cf0418f27e5d5f209ae4f677668163a90087df4a62b4ed070ff348",
	name: "sendRegisterOtp",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => sendRegisterOtp.__executeServer(opts));
var sendRegisterOtp = createServerFn({ method: "POST" }).validator(record).handler(sendRegisterOtp_createServerFn_handler, async ({ data }) => {
	const { issueRegisterOtp } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return issueRegisterOtp({
		name: text(data, "name"),
		password: text(data, "password"),
		gmail: text(data, "gmail")
	});
});
var finishRegister_createServerFn_handler = createServerRpc({
	id: "49b533c280b56dc68399dc9b3485ed00e007a6122be0c3f5ee35bd063c321d5f",
	name: "finishRegister",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => finishRegister.__executeServer(opts));
var finishRegister = createServerFn({ method: "POST" }).validator(record).handler(finishRegister_createServerFn_handler, async ({ data }) => {
	const { confirmRegister } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return confirmRegister({
		gmail: text(data, "gmail"),
		code: text(data, "code")
	});
});
var enterStudio_createServerFn_handler = createServerRpc({
	id: "3f018d5904f3cffae293ab50a0df7a26f7e6247649172ce0b1952faea4e4bc07",
	name: "enterStudio",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => enterStudio.__executeServer(opts));
var enterStudio = createServerFn({ method: "POST" }).validator(record).handler(enterStudio_createServerFn_handler, async ({ data }) => {
	const { loginUser } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return loginUser({
		name: text(data, "name"),
		gmail: text(data, "gmail")
	});
});
var currentUser_createServerFn_handler = createServerRpc({
	id: "dd6fa6f3ba3ce84476c171de76c2bcbb88d15ad4756cb6b207919c55d1ffe3e6",
	name: "currentUser",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => currentUser.__executeServer(opts));
var currentUser = createServerFn({ method: "POST" }).validator(record).handler(currentUser_createServerFn_handler, async ({ data }) => {
	const { readSession } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return readSession(text(data, "token"));
});
var leaveStudio_createServerFn_handler = createServerRpc({
	id: "c576588fe8eee9aa1210fec63bd63f79e8181679481845af1a3fe25c563e5a57",
	name: "leaveStudio",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => leaveStudio.__executeServer(opts));
var leaveStudio = createServerFn({ method: "POST" }).validator(record).handler(leaveStudio_createServerFn_handler, async ({ data }) => {
	const { logoutUser } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return logoutUser(text(data, "token"));
});
var loadInbox_createServerFn_handler = createServerRpc({
	id: "1bbe3ef7819965d2bee72289a79662e28fb7764a7cafebdfd9ebc6e38a3a2d76",
	name: "loadInbox",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => loadInbox.__executeServer(opts));
var loadInbox = createServerFn({ method: "POST" }).validator(record).handler(loadInbox_createServerFn_handler, async ({ data }) => {
	const { readInbox } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return readInbox(text(data, "token"));
});
var makeGmail_createServerFn_handler = createServerRpc({
	id: "0184a05192a2ac37a674644f44e81c9747bed1fca07a5e3f6c6c5735844c53ec",
	name: "makeGmail",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => makeGmail.__executeServer(opts));
var makeGmail = createServerFn({ method: "POST" }).validator(record).handler(makeGmail_createServerFn_handler, async ({ data }) => {
	const { generateAddress } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return generateAddress(text(data, "token"));
});
var enterQwen_createServerFn_handler = createServerRpc({
	id: "b1f18658a6a9b7e1cc8dbac4887a83ec635bbf8b6f5818335941749d6efe6707",
	name: "enterQwen",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => enterQwen.__executeServer(opts));
var enterQwen = createServerFn({ method: "POST" }).validator(record).handler(enterQwen_createServerFn_handler, async ({ data }) => {
	const { loginAdmin } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return loginAdmin({
		username: text(data, "username"),
		password: text(data, "password"),
		gmail: text(data, "gmail"),
		keyword: text(data, "keyword")
	});
});
var leaveQwen_createServerFn_handler = createServerRpc({
	id: "d2ba0760dcd3876f44b9205985c03a7149b8aab3ffbf4911f5dbcfa8d946457c",
	name: "leaveQwen",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => leaveQwen.__executeServer(opts));
var leaveQwen = createServerFn({ method: "POST" }).validator(record).handler(leaveQwen_createServerFn_handler, async ({ data }) => {
	const { logoutAdmin } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return logoutAdmin(text(data, "token"));
});
var loadAdmin_createServerFn_handler = createServerRpc({
	id: "99f4d3dc37556fea3b1edbd39c6ff440085b4e54732421f32b3cd67a481a0f2b",
	name: "loadAdmin",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => loadAdmin.__executeServer(opts));
var loadAdmin = createServerFn({ method: "POST" }).validator(record).handler(loadAdmin_createServerFn_handler, async ({ data }) => {
	const { readAdmin } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return readAdmin(text(data, "token"));
});
var giveCode_createServerFn_handler = createServerRpc({
	id: "3b9116b112b3709b31e834c058fe1dea863a1659a82b30b0ae574e2301052792",
	name: "giveCode",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => giveCode.__executeServer(opts));
var giveCode = createServerFn({ method: "POST" }).validator(record).handler(giveCode_createServerFn_handler, async ({ data }) => {
	const { pushCode } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return pushCode(text(data, "token"), text(data, "address"), text(data, "code"));
});
var dropUser_createServerFn_handler = createServerRpc({
	id: "996ccc0010369508ed30c1ec5815ac75888e604e24b57eb3fc65d28814aef13b",
	name: "dropUser",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => dropUser.__executeServer(opts));
var dropUser = createServerFn({ method: "POST" }).validator(record).handler(dropUser_createServerFn_handler, async ({ data }) => {
	const { removeUserComplete } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return removeUserComplete(text(data, "token"), text(data, "userId"));
});
var storeSmtp_createServerFn_handler = createServerRpc({
	id: "f5999162b35af33ffe6fddeb4d487636dcb825fb284ba8add31f8e6f52e8785d",
	name: "storeSmtp",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => storeSmtp.__executeServer(opts));
var storeSmtp = createServerFn({ method: "POST" }).validator(record).handler(storeSmtp_createServerFn_handler, async ({ data }) => {
	const { saveSmtp } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return saveSmtp(text(data, "token"), text(data, "user"), text(data, "pass"), text(data, "clear") === "1");
});
var clearOtps_createServerFn_handler = createServerRpc({
	id: "226587ca6ee243d88f83499db4313f576b1afbaa4ee5cda9a05a1b696b9136fe",
	name: "clearOtps",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => clearOtps.__executeServer(opts));
var clearOtps = createServerFn({ method: "POST" }).validator(record).handler(clearOtps_createServerFn_handler, async ({ data }) => {
	const { clearAllOtps } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return clearAllOtps(text(data, "token"));
});
var saveStudio_createServerFn_handler = createServerRpc({
	id: "6c54271c02098afee932e7e064f02ca803d2680851c91644ead7d7eac9471d6b",
	name: "saveStudio",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => saveStudio.__executeServer(opts));
var saveStudio = createServerFn({ method: "POST" }).validator(record).handler(saveStudio_createServerFn_handler, async ({ data }) => {
	const { saveStudioSettings } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return saveStudioSettings(text(data, "token"), {
		intro: text(data, "intro"),
		login: text(data, "login"),
		generate: text(data, "generate"),
		announcement: text(data, "announcement"),
		maxGenerate: text(data, "maxGenerate")
	});
});
var setBan_createServerFn_handler = createServerRpc({
	id: "7a70546d449cd04470d898fbde16e3ed5b368aa517d3e9de15bf887e5819b226",
	name: "setBan",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => setBan.__executeServer(opts));
var setBan = createServerFn({ method: "POST" }).validator(record).handler(setBan_createServerFn_handler, async ({ data }) => {
	const { setUserBanned } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return setUserBanned(text(data, "token"), text(data, "userId"), text(data, "banned") === "1");
});
var bootUser_createServerFn_handler = createServerRpc({
	id: "02c130bf183fd8618aae687a9f2c41edafe2db5135be1ba4d11d9f614af8daca",
	name: "bootUser",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => bootUser.__executeServer(opts));
var bootUser = createServerFn({ method: "POST" }).validator(record).handler(bootUser_createServerFn_handler, async ({ data }) => {
	const { forceLogout } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return forceLogout(text(data, "token"), text(data, "userId"));
});
var revokeBox_createServerFn_handler = createServerRpc({
	id: "0265fdb9b3431c0c8c67eef05642a515d4926fc07d034b27a8285c21b79bce93",
	name: "revokeBox",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => revokeBox.__executeServer(opts));
var revokeBox = createServerFn({ method: "POST" }).validator(record).handler(revokeBox_createServerFn_handler, async ({ data }) => {
	const { revokeAddress } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return revokeAddress(text(data, "token"), text(data, "address"));
});
var wipeCode_createServerFn_handler = createServerRpc({
	id: "9b607c6d6120d4a0d657be4433e32f5e8fe373d47d7d26cf761913871345cd64",
	name: "wipeCode",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => wipeCode.__executeServer(opts));
var wipeCode = createServerFn({ method: "POST" }).validator(record).handler(wipeCode_createServerFn_handler, async ({ data }) => {
	const { clearAddressCode } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return clearAddressCode(text(data, "token"), text(data, "address"));
});
var trySmtp_createServerFn_handler = createServerRpc({
	id: "6a736fecdb62dbfa72071ec8b3e246e524ca0df78c3d0e6f20bfd138e088047f",
	name: "trySmtp",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => trySmtp.__executeServer(opts));
var trySmtp = createServerFn({ method: "POST" }).validator(record).handler(trySmtp_createServerFn_handler, async ({ data }) => {
	const { sendSmtpTest } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return sendSmtpTest(text(data, "token"));
});
var loadPublic_createServerFn_handler = createServerRpc({
	id: "24a750bbf8fb8904249f50770bc78d67b4d05ef269a3546e3b992102668dd04d",
	name: "loadPublic",
	filename: "src/lib/qwen.functions.ts"
}, (opts) => loadPublic.__executeServer(opts));
var loadPublic = createServerFn({ method: "POST" }).validator(record).handler(loadPublic_createServerFn_handler, async () => {
	const { publicConfig } = await import("./qwen.server-D4ASEPTx.mjs").then((n) => n.n);
	return publicConfig();
});
//#endregion
export { bootUser_createServerFn_handler, clearOtps_createServerFn_handler, currentUser_createServerFn_handler, dropUser_createServerFn_handler, enterQwen_createServerFn_handler, enterStudio_createServerFn_handler, finishRegister_createServerFn_handler, giveCode_createServerFn_handler, leaveQwen_createServerFn_handler, leaveStudio_createServerFn_handler, loadAdmin_createServerFn_handler, loadInbox_createServerFn_handler, loadPublic_createServerFn_handler, makeGmail_createServerFn_handler, revokeBox_createServerFn_handler, saveStudio_createServerFn_handler, sendRegisterOtp_createServerFn_handler, setBan_createServerFn_handler, storeSmtp_createServerFn_handler, trySmtp_createServerFn_handler, wipeCode_createServerFn_handler };
