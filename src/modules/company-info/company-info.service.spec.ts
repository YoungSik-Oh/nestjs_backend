import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyInfoService } from './company-info.service';
import { CompanyInfo } from './entities/company-info.entity';

describe('CompanyInfoService', () => {
  let service: CompanyInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyInfoService,
        { provide: getRepositoryToken(CompanyInfo), useValue: {} },
      ],
    }).compile();

    service = module.get<CompanyInfoService>(CompanyInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
