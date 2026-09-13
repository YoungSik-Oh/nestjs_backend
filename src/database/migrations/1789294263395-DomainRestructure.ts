import { MigrationInterface, QueryRunner } from 'typeorm';

export class DomainRestructure1789294263395 implements MigrationInterface {
  name = 'DomainRestructure1789294263395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "USER" DROP COLUMN "REGIST_AT"`);
    await queryRunner.query(`ALTER TABLE "USER" DROP COLUMN "UPDATE_AT"`);
    await queryRunner.query(`ALTER TABLE "BOARD" DROP COLUMN "REGIST_AT"`);
    await queryRunner.query(`ALTER TABLE "BOARD" DROP COLUMN "UPDATE_AT"`);
    await queryRunner.query(
      `ALTER TABLE "USER" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "USER"."createdAt" IS '등록 일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "USER" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "USER"."updatedAt" IS '수정 일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "BOARD" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "BOARD"."createdAt" IS '등록 일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "BOARD" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "BOARD"."updatedAt" IS '수정 일자'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "BOARD"."updatedAt" IS '수정 일자'`,
    );
    await queryRunner.query(`ALTER TABLE "BOARD" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "BOARD"."createdAt" IS '등록 일자'`,
    );
    await queryRunner.query(`ALTER TABLE "BOARD" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "USER"."updatedAt" IS '수정 일자'`,
    );
    await queryRunner.query(`ALTER TABLE "USER" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "USER"."createdAt" IS '등록 일자'`,
    );
    await queryRunner.query(`ALTER TABLE "USER" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "BOARD" ADD "UPDATE_AT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "BOARD" ADD "REGIST_AT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "USER" ADD "UPDATE_AT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "USER" ADD "REGIST_AT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }
}
