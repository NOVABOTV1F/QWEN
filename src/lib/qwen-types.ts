export type Fail = { ok: false; error: string };

export type SessionUser = {
  ok: true;
  token: string;
  name: string;
  gmail: string;
};

export type OtpTicket = {
  ok: true;
  delivered: boolean;
  code: string | null;
};

export type InboxItem = {
  address: string;
  code: string | null;
  createdAt: string;
};

export type Inbox = {
  ok: true;
  address: string | null;
  code: string | null;
  items: InboxItem[];
};

export type AdminUser = {
  id: string;
  name: string;
  gmail: string;
  address: string | null;
  addressCount: number;
  banned: boolean;
  createdAt: string;
};

export type AdminBox = {
  address: string;
  owner: string;
  ownerGmail: string;
  code: string | null;
  createdAt: string;
};

export type PendingOtp = {
  gmail: string;
  name: string;
  code: string;
};

export type ActivityRow = {
  id: string;
  kind: string;
  detail: string;
  createdAt: string;
};

export type AdminStats = {
  users: number;
  addresses: number;
  otps: number;
  pending: number;
  sessions: number;
};

export type StudioSettings = {
  intro: string;
  login: string;
  generate: string;
  announcement: string;
  maxGenerate: number;
};

export type AdminBoard = {
  ok: true;
  users: AdminUser[];
  boxes: AdminBox[];
  pending: PendingOtp[];
  activity: ActivityRow[];
  stats: AdminStats;
  smtpReady: boolean;
  smtpUser: string;
  settings: StudioSettings;
};

export type AdminSession = { ok: true; token: string };

export type PublicConfig = {
  ok: true;
  intro: string;
  login: string;
  generate: string;
  announcement: string;
};
