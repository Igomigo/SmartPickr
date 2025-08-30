import { Response } from "express";

export class SSEConnection {
  private hb?: NodeJS.Timeout;

  constructor(private res: Response, retryMs = 10000) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // avoid proxy buffering
    res.flushHeaders();
    res.write(`retry: ${retryMs}\n\n`);
    this.hb = setInterval(() => res.write(`: keep-alive\n\n`), 15000);
    res.on("close", () => this.end());
  }

  send(event: "summary" | "comparison" | "recommendation", data: unknown) {
    this.res.write(`event: ${event}\n`);
    this.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  end() {
    if (this.hb) clearInterval(this.hb);
    this.res.end();
  }
}
