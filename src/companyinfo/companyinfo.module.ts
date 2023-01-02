import { Module } from '@nestjs/common';
import { CompanyinfoService } from './companyinfo.service';
import { CompanyinfoController } from './companyinfo.controller';
import { DatabaseModule } from 'src/@database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CompanyinfoService],
  controllers: [CompanyinfoController],
})
export class CompanyinfoModule {}
