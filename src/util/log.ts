import fs from 'fs';
import path from 'path';
import winston from 'winston';

import { DataHora } from './dataHora';

// Diretório de logs
const logDir = path.join('log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const date = DataHora.obterDataAtual('DD-MM-YYYY');

const logFile = path.join(logDir, `log-${date}.log`);

const fileTransport = new winston.transports.File({ filename: logFile, level: 'info' });

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message }) => {
    const time = DataHora.formatarDataHora(String(timestamp), 'DD/MM/YYYY HH:mm:ss');
    return `${time} [${level.toUpperCase()}]: ${message}`;
  }),
);

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [new winston.transports.Console(), fileTransport],
});

const customLogger = (level: string, message: string, additional?: any) => {
  let formattedMessage = message;
  if (additional !== undefined) {
    const additionalFormatted = typeof additional === 'object' ? JSON.stringify(additional, null, 2) : String(additional);
    formattedMessage += `\n${additionalFormatted}`;
  }
  logger.log({ level, message: formattedMessage });
};

export const Log = {
  info: (message: string, additional?: any) => customLogger('info', message, additional),
  error: (message: string, additional?: any) => customLogger('error', message, additional),
  warn: (message: string, additional?: any) => customLogger('warn', message, additional),
  debug: (message: string, additional?: any) => customLogger('debug', message, additional),
};
