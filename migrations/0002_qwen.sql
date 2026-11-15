create table if not exists qwen_users (
  id text primary key,
  name text not null,
  gmail text not null unique,
  password_hash text not null,
  password_salt text not null,
  banned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists qwen_reg_otp (
  gmail text primary key,
  name text not null,
  password_hash text not null,
  password_salt text not null,
  code text not null,
  expires_at timestamptz not null
);

create table if not exists qwen_sessions (
  token text primary key,
  user_id text not null references qwen_users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists qwen_admin_sessions (
  token text primary key,
  created_at timestamptz not null default now()
);

create table if not exists qwen_addresses (
  id text primary key,
  user_id text not null references qwen_users (id) on delete cascade,
  address text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists qwen_addresses_user_idx on qwen_addresses (user_id, created_at desc);

create table if not exists qwen_otps (
  id text primary key,
  address text not null,
  code text not null,
  created_at timestamptz not null default now()
);

create index if not exists qwen_otps_address_idx on qwen_otps (address, created_at desc);

create table if not exists qwen_settings (
  key text primary key,
  value text not null
);

create table if not exists qwen_activity (
  id text primary key,
  kind text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create index if not exists qwen_activity_created_idx on qwen_activity (created_at desc);
