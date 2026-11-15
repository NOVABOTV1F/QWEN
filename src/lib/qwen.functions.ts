import { createServerFn } from "@tanstack/react-start";

function record(input: unknown) {
  if (!input || typeof input !== "object") throw new Error("Data tidak lengkap.");
  return input as Record<string, unknown>;
}

function text(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return typeof value === "string" ? value : "";
}

export const sendRegisterOtp = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { issueRegisterOtp } = await import("./qwen.server");
    return issueRegisterOtp({
      name: text(data, "name"),
      password: text(data, "password"),
      gmail: text(data, "gmail"),
    });
  });

export const finishRegister = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { confirmRegister } = await import("./qwen.server");
    return confirmRegister({ gmail: text(data, "gmail"), code: text(data, "code") });
  });

export const enterStudio = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { loginUser } = await import("./qwen.server");
    return loginUser({ name: text(data, "name"), gmail: text(data, "gmail") });
  });

export const currentUser = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { readSession } = await import("./qwen.server");
    return readSession(text(data, "token"));
  });

export const leaveStudio = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { logoutUser } = await import("./qwen.server");
    return logoutUser(text(data, "token"));
  });

export const loadInbox = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { readInbox } = await import("./qwen.server");
    return readInbox(text(data, "token"));
  });

export const makeGmail = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { generateAddress } = await import("./qwen.server");
    return generateAddress(text(data, "token"));
  });

export const enterQwen = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { loginAdmin } = await import("./qwen.server");
    return loginAdmin({
      username: text(data, "username"),
      password: text(data, "password"),
      gmail: text(data, "gmail"),
      keyword: text(data, "keyword"),
    });
  });

export const leaveQwen = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { logoutAdmin } = await import("./qwen.server");
    return logoutAdmin(text(data, "token"));
  });

export const loadAdmin = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { readAdmin } = await import("./qwen.server");
    return readAdmin(text(data, "token"));
  });

export const giveCode = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { pushCode } = await import("./qwen.server");
    return pushCode(text(data, "token"), text(data, "address"), text(data, "code"));
  });

export const dropUser = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { removeUserComplete } = await import("./qwen.server");
    return removeUserComplete(text(data, "token"), text(data, "userId"));
  });

export const storeSmtp = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { saveSmtp } = await import("./qwen.server");
    return saveSmtp(text(data, "token"), text(data, "user"), text(data, "pass"), text(data, "clear") === "1");
  });

export const clearOtps = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { clearAllOtps } = await import("./qwen.server");
    return clearAllOtps(text(data, "token"));
  });

export const saveStudio = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { saveStudioSettings } = await import("./qwen.server");
    return saveStudioSettings(text(data, "token"), {
      intro: text(data, "intro"),
      login: text(data, "login"),
      generate: text(data, "generate"),
      announcement: text(data, "announcement"),
      maxGenerate: text(data, "maxGenerate"),
    });
  });

export const setBan = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { setUserBanned } = await import("./qwen.server");
    return setUserBanned(text(data, "token"), text(data, "userId"), text(data, "banned") === "1");
  });

export const bootUser = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { forceLogout } = await import("./qwen.server");
    return forceLogout(text(data, "token"), text(data, "userId"));
  });

export const revokeBox = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { revokeAddress } = await import("./qwen.server");
    return revokeAddress(text(data, "token"), text(data, "address"));
  });

export const wipeCode = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { clearAddressCode } = await import("./qwen.server");
    return clearAddressCode(text(data, "token"), text(data, "address"));
  });

export const trySmtp = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async ({ data }) => {
    const { sendSmtpTest } = await import("./qwen.server");
    return sendSmtpTest(text(data, "token"));
  });

export const loadPublic = createServerFn({ method: "POST" })
  .validator(record)
  .handler(async () => {
    const { publicConfig } = await import("./qwen.server");
    return publicConfig();
  });
