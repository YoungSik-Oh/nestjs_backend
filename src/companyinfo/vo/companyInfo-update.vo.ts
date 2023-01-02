import { PartialType } from '@nestjs/mapped-types';
import { CompanyInfoRegistVo } from './companyInfo-regist.vo';

export class CompanyInfoUpdateVo extends PartialType(CompanyInfoRegistVo) {}
