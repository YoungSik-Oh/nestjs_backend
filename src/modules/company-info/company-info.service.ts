import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyInfoDto } from './dto/create-company-info.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { CompanyInfo } from './entities/company-info.entity';

@Injectable()
export class CompanyInfoService {
  private readonly logger = new Logger(CompanyInfoService.name);

  constructor(
    @InjectRepository(CompanyInfo)
    private companyInfoRepository: Repository<CompanyInfo>,
  ) {}

  async getCompanyInfo(): Promise<CompanyInfo[]> {
    return this.companyInfoRepository.find();
  }

  async createCompanyInfo(
    createCompanyInfoDto: CreateCompanyInfoDto,
  ): Promise<CompanyInfo> {
    return this.companyInfoRepository.save(
      this.companyInfoRepository.create(createCompanyInfoDto),
    );
  }

  async updateCompanyInfo(
    uuid: string,
    updateCompanyInfoDto: UpdateCompanyInfoDto,
  ): Promise<CompanyInfo> {
    const savedData = await this.companyInfoRepository
      .findOneOrFail({ where: { uuid } })
      .catch(() => {
        throw new NotFoundException(`업데이트 할 정보가 없습니다.`);
      });

    await this.companyInfoRepository.save({
      ...savedData,
      ...updateCompanyInfoDto,
    });

    return this.companyInfoRepository.findOneOrFail({ where: { uuid } });
  }
}
