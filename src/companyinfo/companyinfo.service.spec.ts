import { Test, TestingModule } from '@nestjs/testing';
import { CompanyinfoService } from './companyinfo.service';

describe('CompanyinfoService', () => {
  let service: CompanyinfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyinfoService],
    }).compile();

    service = module.get<CompanyinfoService>(CompanyinfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
