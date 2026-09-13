import { IsString, MaxLength } from 'class-validator';
import { BoardCategory } from '../entities/board.entity';

export class CreateBoardDto {
  @IsString()
  @MaxLength(30)
  category!: BoardCategory;

  @IsString()
  title!: string;

  @IsString()
  contents!: string;

  @IsString()
  writerID!: string;
}
