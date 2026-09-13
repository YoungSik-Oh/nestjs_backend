import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from '../../boards/entities/board.entity';

@Entity({
  name: 'USER',
})
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'UUID' })
  uuid!: string;

  @Column({
    name: 'USER_ID',
    unique: true,
    nullable: false,
    type: 'varchar',
    length: 50,
    comment: '유저 아이디',
  })
  userID!: string;

  @Column({
    name: 'NAME',
    nullable: true,
    type: 'varchar',
    length: 50,
    comment: '유저 이름',
  })
  name!: string;

  @Column({
    name: 'PASSWORD',
    nullable: false,
    type: 'varchar',
    comment: '비밀번호',
  })
  pwd!: string;

  @Column({
    name: 'EMAIL',
    nullable: true,
    type: 'varchar',
    length: 100,
    comment: '이메일',
  })
  email!: string;

  @Column({
    name: 'PHONE',
    nullable: true,
    type: 'varchar',
    length: 20,
    comment: '휴대전화번호',
  })
  phone!: string;

  @Column({ name: 'AUTHORITY', length: 20, default: '', comment: '권한' })
  authority!: string;

  @CreateDateColumn({ type: 'timestamptz', comment: '등록 일자' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', comment: '수정 일자' })
  updatedAt!: Date;

  @OneToMany(() => Board, (board) => board.writer, {
    lazy: true,
  })
  boards!: Board[];
}
