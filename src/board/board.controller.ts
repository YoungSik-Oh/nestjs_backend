import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { BaordCategory } from 'src/@database/entity/board.entity';
import { BoardService } from './board.service';
import { BoardRegistVo } from './vo/board-regist.vo';

@Controller('board')
export class BoardController {
  private readonly logger = new Logger(BoardController.name);

  constructor(private readonly boardService: BoardService) {}

  @Get('/:ctgy')
  getAllBoard(
    @Param('ctgy') ctgy: BaordCategory,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.boardService.getAllBoard({ page, limit }, ctgy);
  }

  @Get('/detail/:ctgy/:uuid')
  findOneBoard(
    @Param('ctgy') ctgy: BaordCategory,
    @Param('uuid') uuid: string,
  ) {
    return this.boardService.findOneBoard(uuid, ctgy);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  insertBoard(
    @Body() registData: BoardRegistVo,
    @UploadedFiles() file?: Express.Multer.File[],
  ) {
    return this.boardService.insertBoard(registData, file);
  }

  @Patch('/update/:ctgy/:uuid')
  @UseInterceptors(AnyFilesInterceptor())
  updateBoard(@Param('ctgy') ctgy: BaordCategory, @Param('uuid') uuid: string) {
    return this.boardService.updateBoard(ctgy, uuid);
  }
}
