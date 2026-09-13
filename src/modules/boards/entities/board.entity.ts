import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type BoardCategory = 'notice' | 'qna';

@Entity({ name: 'BOARD' })
export class Board {
  @PrimaryGeneratedColumn('uuid', { name: 'UUID' })
  uuid!: string;

  @Column({
    name: 'CATEGORY',
    type: 'varchar',
    nullable: false,
    length: 30,
    comment: '게시판 카테고리',
  })
  category!: BoardCategory;

  @Column({
    name: 'TITLE',
    type: 'varchar',
    nullable: false,
    comment: '게시글 제목',
  })
  title!: string;

  @Column({ name: 'CONTENTS', type: 'text', comment: '게시글 내용' })
  contents!: string;

  @Column({ name: 'HIT', type: 'bigint', comment: '조회수' })
  hit!: number;

  @Column({ name: 'FILE', type: 'text', comment: '첨부파일 이름' })
  file!: string;

  @Column({
    name: 'FILE_REGIST_AT',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '파일 등록 일자',
  })
  file_registAt!: Date;

  @CreateDateColumn({ type: 'timestamptz', comment: '등록 일자' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', comment: '수정 일자' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.boards, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'uuid' })
  writer!: User;

  @RelationId((board: Board) => board.writer)
  writerId!: string;
}
