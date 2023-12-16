// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
  PORT: port({ default: 3010, devDefault: 3010 }),

  SUPABASE_URL: str({ default: "" }),
  SUPABASE_BUCKET: str({ default: "public" }),
  SUPABASE_ANON_KEY: str({ default: "public" }),
});

const _AppConfig = () => ({ ...env } as const);

const CONFIG = _AppConfig();
export const AppConfig = () => CONFIG;
