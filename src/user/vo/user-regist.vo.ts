import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UserRegistVo {
  @IsString()
  @MaxLength(50)
  readonly userID: string;

  @IsString()
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @MaxLength(255)
  readonly pwd: string;

  @IsString()
  @MaxLength(100)
  @Matches(
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
  )
  readonly email: string;

  @IsString()
  @MaxLength(20)
  phone: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  authority?: string;

  // @IsDate()
  // @IsOptional()
  // @Type(() => Date)
  // readonly registAt: Date;
}
