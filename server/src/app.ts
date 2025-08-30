import * as dotenv from "dotenv";
import express, { Express } from "express";
import { EnvGuard } from "env-preflight"; // I wrote this package☺️, find it on https://github.com/Igomigo/env-preflight
import { envRule } from "./utils/env_rule";

dotenv.config();
export class App {
  private readonly app: Express;
  private readonly API_PREFIX = "/api/v1";
  private readonly PORT: number;

  constructor() {
    this.setupEnvGuard();
    this.PORT = Number(process.env.PORT);
    this.app = express();
    this.setUproutes();
  }

  private setUproutes() {}

  private setupEnvGuard() {
    const envGuard = new EnvGuard(envRule);
    envGuard.validate();
  }

  public listen() {
    this.app.listen(this.PORT, () => {
      console.log(
        `SmartPickr server listening on http://localhost:${this.PORT}`
      );
    });
  }
}
