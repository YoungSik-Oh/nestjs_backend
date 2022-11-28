import { ConsoleLogger, Logger } from '@nestjs/common';
import 'winston-daily-rotate-file';
import * as winston from 'winston';

export class FileConsoleLogger extends ConsoleLogger {
  private readonly logger;
  // console logger
  constructor({ filename, dirname }: { filename: string; dirname: string }) {
    super();

    const { combine, timestamp, json } = winston.format;

    this.logger = winston.createLogger({
      format: combine(timestamp(), json()),
      transports: [
        new winston.transports.DailyRotateFile({
          level: 'info',
          filename: `${filename}-%DATE%.log`,
          datePattern: 'YYYYMMDD',
          maxSize: '50m',
          maxFiles: 20,
          dirname,
        }),
        new winston.transports.DailyRotateFile({
          level: 'error',
          filename: `${filename}-%DATE%.error.log`,
          datePattern: 'YYYYMMDD',
          maxSize: '50m',
          maxFiles: 20,
          dirname,
        }),
      ],
    });

    // Production 환경이 아닌 경우
    // if (process.env.NODE_ENV !== 'production') {
    //   const { colorize, simple } = winston.format
    //   this.logger.add(
    //     new winston.transports.Console({
    //       format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), simple()), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
    //     }),
    //   )
    // }
  }

  log(message: string, context?: string) {
    super.log(message, context);
    this.logger.info(message);
  }

  error(message: string, trace: string, context?: string) {
    super.error(message, trace, context);
    this.logger.error(JSON.stringify(message));
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);
  }
}
