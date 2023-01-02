import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CompanyInfoRegistVo {
  @IsString()
  @MaxLength(10)
  name: string;

  @IsString()
  @MaxLength(10)
  ceo: string;

  @IsString()
  @MaxLength(30)
  email: string;

  @IsString()
  @MaxLength(50)
  company_reg_no: string;

  @IsString()
  COMPANY_ADDRESS: string;
}
