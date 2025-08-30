import * as dotenv from "dotenv";
import express, { Express } from "express";
import { EnvGuard } from "env-preflight"; // I wrote this package☺️, find it on https://github.com/Igomigo/env-preflight
import { envRule } from "./utils/env_rule";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

// Middleware

// Routes
import productRoutes from "./routes/product.routes";

dotenv.config();
export class App {
  private readonly app: Express;
  private readonly API_PREFIX = "/api/v1";
  private readonly PORT: number;

  constructor() {
    this.setupEnvGuard();
    this.PORT = Number(process.env.PORT);
    this.app = express();
    this.setUpMiddlewares();
    this.setUproutes();
  }

  private setUpMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(morgan("dev"));
  }

  private setUproutes() {
    this.app.use(`${this.API_PREFIX}`, productRoutes);
  }

  private setupEnvGuard() {
    const envGuard = new EnvGuard(envRule);
    envGuard.validate();
  }

  public listen() {
    this.app.listen(this.PORT, () => {
      console.log(
        `🧠🔎SmartPickr server listening on http://localhost:${this.PORT}`
      );
    });
  }
}
