import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1789289335545 implements MigrationInterface {
  name = 'Init1789289335545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "USER" ("UUID" uuid NOT NULL DEFAULT uuid_generate_v4(), "USER_ID" character varying(50) NOT NULL, "NAME" character varying(50), "PASSWORD" character varying NOT NULL, "EMAIL" character varying(100), "PHONE" character varying(20), "AUTHORITY" character varying(20) NOT NULL DEFAULT '', "REGIST_AT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_83bc997badef7070d50845f1e9b" UNIQUE ("USER_ID"), CONSTRAINT "PK_6f651275f83f8e2c29fe86ababb" PRIMARY KEY ("UUID")); COMMENT ON COLUMN "USER"."USER_ID" IS '유저 아이디'; COMMENT ON COLUMN "USER"."NAME" IS '유저 이름'; COMMENT ON COLUMN "USER"."PASSWORD" IS '비밀번호'; COMMENT ON COLUMN "USER"."EMAIL" IS '이메일'; COMMENT ON COLUMN "USER"."PHONE" IS '휴대전화번호'; COMMENT ON COLUMN "USER"."AUTHORITY" IS '권한'; COMMENT ON COLUMN "USER"."REGIST_AT" IS '등록 일자'; COMMENT ON COLUMN "USER"."UPDATE_AT" IS '수정 일자'`,
    );
    await queryRunner.query(
      `CREATE TABLE "BOARD" ("UUID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CATEGORY" character varying(30) NOT NULL, "TITLE" character varying NOT NULL, "CONTENTS" text NOT NULL, "HIT" bigint NOT NULL, "FILE" text NOT NULL, "FILE_REGIST_AT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "REGIST_AT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "writer_id" uuid, CONSTRAINT "PK_8d4e1a37146cc14ad38ad784c8c" PRIMARY KEY ("UUID")); COMMENT ON COLUMN "BOARD"."CATEGORY" IS '게시판 카테고리'; COMMENT ON COLUMN "BOARD"."TITLE" IS '게시글 제목'; COMMENT ON COLUMN "BOARD"."CONTENTS" IS '게시글 내용'; COMMENT ON COLUMN "BOARD"."HIT" IS '조회수'; COMMENT ON COLUMN "BOARD"."FILE" IS '첨부파일 이름'; COMMENT ON COLUMN "BOARD"."FILE_REGIST_AT" IS '파일 등록 일자'; COMMENT ON COLUMN "BOARD"."REGIST_AT" IS '등록 일자'; COMMENT ON COLUMN "BOARD"."UPDATE_AT" IS '수정 일자'`,
    );
    await queryRunner.query(
      `CREATE TABLE "COMPANY_INFO" ("UUID" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(10) NOT NULL, "CEO" character varying(10) NOT NULL, "EMAIL" character varying(30) NOT NULL, "COMPANY_REG_NO" character varying(50) NOT NULL, "COMPANY_ADDRESS" text NOT NULL, CONSTRAINT "PK_59e484419870aa9f11da6ffc86d" PRIMARY KEY ("UUID")); COMMENT ON COLUMN "COMPANY_INFO"."name" IS '사업자 명'; COMMENT ON COLUMN "COMPANY_INFO"."CEO" IS '대표명'; COMMENT ON COLUMN "COMPANY_INFO"."EMAIL" IS '이메일'; COMMENT ON COLUMN "COMPANY_INFO"."COMPANY_REG_NO" IS '사업자등록번호'; COMMENT ON COLUMN "COMPANY_INFO"."COMPANY_ADDRESS" IS '사업자주소'`,
    );
    await queryRunner.query(
      `ALTER TABLE "BOARD" ADD CONSTRAINT "FK_27dde2f092c524f1a3b4f836804" FOREIGN KEY ("writer_id") REFERENCES "USER"("UUID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "BOARD" DROP CONSTRAINT "FK_27dde2f092c524f1a3b4f836804"`,
    );
    await queryRunner.query(`DROP TABLE "COMPANY_INFO"`);
    await queryRunner.query(`DROP TABLE "BOARD"`);
    await queryRunner.query(`DROP TABLE "USER"`);
  }
}
