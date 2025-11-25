class Logger {
  public log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`); // this is what the log message will look like: [2025-11-25T12:00:00.000Z] Hello, world!
  }

  public error(message: string) {
    console.error(`[${new Date().toISOString()}] ${message}`);
  }
}

export const logger = new Logger();
