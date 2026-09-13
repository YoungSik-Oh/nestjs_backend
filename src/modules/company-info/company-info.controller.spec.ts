import { Test, TestingModule } from '@nestjs/testing';
import { CompanyInfoController } from './company-info.controller';

describe('CompanyInfoController', () => {
  let controller: CompanyInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyInfoController],
    }).compile();

    controller = module.get<CompanyInfoController>(CompanyInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
