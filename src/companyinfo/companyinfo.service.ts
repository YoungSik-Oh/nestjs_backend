import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyInfo } from 'src/@database/entity/companyInfo.entity';
import { Repository } from 'typeorm';
import { CompanyInfoRegistVo } from './vo/companyInfo-regist.vo';
import { CompanyInfoUpdateVo } from './vo/companyInfo-update.vo';

@Injectable()
export class CompanyinfoService {
  private readonly logger = new Logger(CompanyinfoService.name);

  constructor(
    @InjectRepository(CompanyInfo)
    private companyInfoRepository: Repository<CompanyInfo>,
  ) {}

  async getCompanyInfo(): Promise<CompanyInfo[]> {
    return this.companyInfoRepository.find();
  }

  async createCompanyInfo(data: CompanyInfoRegistVo): Promise<CompanyInfo> {
    return this.companyInfoRepository.save(data);
  }

  async updateCompanyInfo(
    id: string,
    data: CompanyInfoUpdateVo,
  ): Promise<CompanyInfo> {
    const savedData = await this.companyInfoRepository.findOneOrFail({
      where: {
        uuid: id,
      },
    });
    if (!savedData) {
      throw new NotFoundException(`업데이트 할 정보가 없습니다.`);
    }

    const updateData = await this.companyInfoRepository
      .save({
        ...savedData,
        data,
      })
      .catch((error) => {
        console.log('update error ', error);
      });

    if (!updateData) {
      console.log('update error ', updateData);
      throw new BadRequestException(`업데이트에 실패하였습니다.`);
    }

    return this.companyInfoRepository.findOne({
      where: {
        uuid: updateData.uuid,
      },
    });
  }
}
