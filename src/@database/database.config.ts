import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { FileQueryLogger } from 'src/logger/file_query_logger';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const properties = this.configService.get('database');

    return {
      ...properties,
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      logger: new FileQueryLogger({
        options: 'all',
        filename: properties.logger.filename,
        dirname: properties.logger.dirname,
      }),
    };
  }
}
