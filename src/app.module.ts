import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/config';
import { validate } from './config/env.validation';
import { DatabaseConfig } from './database/database.config';
import { HealthModule } from './health/health.module';
import { BoardsModule } from './modules/boards/boards.module';
import { CompanyInfoModule } from './modules/company-info/company-info.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config], validate }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    HealthModule,
    UsersModule,
    BoardsModule,
    CompanyInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
