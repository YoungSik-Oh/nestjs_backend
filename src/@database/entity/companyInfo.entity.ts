import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity({ name: 'COMPANY_INFO' })
export class CompanyInfo {
  @PrimaryColumn({ name: 'UUID' })
  @Generated('uuid')
  uuid: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
    length: 10,
    comment: '사업자 명',
  })
  name: string;

  @Column({
    name: 'CEO',
    type: 'varchar',
    nullable: false,
    length: 10,
    comment: '대표명',
  })
  ceo: string;

  @Column({
    name: 'EMAIL',
    type: 'varchar',
    nullable: false,
    length: 30,
    comment: '이메일',
  })
  email: string;

  @Column({
    name: 'COMPANY_REG_NO',
    type: 'varchar',
    nullable: false,
    length: 50,
    comment: '사업자등록번호',
  })
  company_reg_no: string;

  @Column({
    name: 'COMPANY_ADDRESS',
    type: 'longtext',
    nullable: false,
    comment: '사업자주소',
  })
  company_address: string;
}
