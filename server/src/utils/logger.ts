const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
  private level: number;

  constructor(level: LogLevel = 'info') {
    this.level = LOG_LEVELS[level];
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (LOG_LEVELS[level] <= this.level) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      
      if (data) {
        console.log(logMessage, JSON.stringify(data, null, 2));
      } else {
        console.log(logMessage);
      }
    }
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
}

export default new Logger();
