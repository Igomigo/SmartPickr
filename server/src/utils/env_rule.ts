import { EnvGuardConfig } from "env-preflight";

export const envRule: EnvGuardConfig = {
  required: {
    PORT: "number",
  },
};
