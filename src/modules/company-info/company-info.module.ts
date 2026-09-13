import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyInfoController } from './company-info.controller';
import { CompanyInfoService } from './company-info.service';
import { CompanyInfo } from './entities/company-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyInfo])],
  controllers: [CompanyInfoController],
  providers: [CompanyInfoService],
})
export class CompanyInfoModule {}
