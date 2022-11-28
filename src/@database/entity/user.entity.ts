import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import { Board } from './board.entity';

@Entity({
  name: 'USER',
})
export class User {
  @PrimaryColumn({ name: 'UUID' })
  @Generated('uuid')
  uuid: string;

  @Column({
    name: 'USER_ID',
    unique: true,
    nullable: false,
    type: 'varchar',
    length: 50,
    comment: '유저 아이디',
  })
  userID: string;

  @Column({
    name: 'NAME',
    nullable: true,
    type: 'varchar',
    length: 50,
    comment: '유저 이름',
  })
  name: string;

  @Column({
    name: 'PASSWORD',
    nullable: false,
    type: 'varchar',
    comment: '비밀번호',
  })
  pwd: string;

  @Column({
    name: 'EMAIL',
    nullable: true,
    type: 'varchar',
    length: 100,
    comment: '이메일',
  })
  email: string;

  @Column({
    name: 'PHONE',
    nullable: true,
    type: 'varchar',
    length: 20,
    comment: '휴대전화번호',
  })
  phone: string;

  @Column({ name: 'AUTHORITY', length: 20, default: '', comment: '권한' })
  authority: string;

  @Column({
    name: 'REGIST_AT',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '등록 일자',
  })
  registAt: Date;

  @Column({
    name: 'UPDATE_AT',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '수정 일자',
  })
  updateAt: Date;

  @OneToMany(() => Board, (board) => board.writer, {
    lazy: true,
  })
  boards: Board[];
}
