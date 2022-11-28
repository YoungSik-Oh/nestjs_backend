import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

const modules = [TypeOrmModule.forFeature([User])];

@Module({
  imports: modules,
  exports: modules,
})
export class DatabaseModule {}
