import { EnvGuardConfig } from "env-preflight";

export const envRule: EnvGuardConfig = {
  required: {
    PORT: "number",
    X_CUSTOM_TOKEN: "string",
  },
};
