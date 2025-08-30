import { Response } from "express";

export class SSEService {
  // Step 1: Initialize the SSE connection
  init(res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // Make sure headers are sent immediately
  }

  // Step 2: Send an event
  send(res: Response, eventName: string, data: any) {
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  // Step 3: Close the connection
  close(res: Response) {
    res.end();
  }
}
