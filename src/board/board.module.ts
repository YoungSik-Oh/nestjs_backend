import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from 'src/@database/database.module';
import { MulterConfig } from 'src/config/config.multer';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: MulterConfig,
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
