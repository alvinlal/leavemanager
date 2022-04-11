import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf, json } = format;

const printerFn = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(format.colorize(), timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), printerFn),
  transports: [new transports.Console()],
});

global.logger = logger;

export default logger;
