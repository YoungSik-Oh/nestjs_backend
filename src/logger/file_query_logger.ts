import { AdvancedConsoleLogger, QueryRunner } from 'typeorm';
import 'winston-daily-rotate-file';
import * as winston from 'winston';

export class FileQueryLogger extends AdvancedConsoleLogger {
  // query log
  private readonly logger;

  constructor({
    options,
    filename,
    dirname,
  }: {
    options?:
      | boolean
      | 'all'
      | ('log' | 'info' | 'warn' | 'query' | 'schema' | 'error' | 'migration')[]
      | undefined;
    filename: string;
    dirname: string;
  }) {
    super(options);

    const { combine, timestamp, json } = winston.format;

    this.logger = winston.createLogger({
      format: combine(timestamp(), json()),
      transports: [
        new winston.transports.DailyRotateFile({
          level: 'info',
          filename: `${filename}-%DATE%.query.log`,
          datePattern: 'YYYYMMDD',
          maxSize: '50m',
          maxFiles: 20,
          dirname,
        }),
        new winston.transports.DailyRotateFile({
          level: 'error',
          filename: `${filename}-%DATE%.query.error.log`,
          datePattern: 'YYYYMMDD',
          maxSize: '50m',
          maxFiles: 20,
          dirname,
        }),
      ],
    });
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    super.logQuery(query, parameters, queryRunner);
    this.logger.info(query);
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    super.logQueryError(error, query, parameters, queryRunner);
    this.logger.error(query);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    super.logQuerySlow(time, query, parameters, queryRunner);
    this.logger.warn(query);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    super.logSchemaBuild(message, queryRunner);
    this.logger.verbose(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    super.logMigration(message, queryRunner);
    this.logger.verbose(message);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    super.log(level, message, queryRunner);
    this.logger.log(level, message);
  }
}
