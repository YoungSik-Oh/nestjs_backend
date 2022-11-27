import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const modules = [TypeOrmModule.forFeature([])];

@Module({
  imports: modules,
  exports: modules,
})
export class DatabaseModule {}
