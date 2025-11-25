class Logger {
  public log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  public error(message: string) {
    console.error(`[${new Date().toISOString()}] ${message}`);
  }
}

export const logger = new Logger();
