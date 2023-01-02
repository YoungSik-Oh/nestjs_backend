import { Test, TestingModule } from '@nestjs/testing';
import { CompanyinfoController } from './companyinfo.controller';

describe('CompanyinfoController', () => {
  let controller: CompanyinfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyinfoController],
    }).compile();

    controller = module.get<CompanyinfoController>(CompanyinfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
