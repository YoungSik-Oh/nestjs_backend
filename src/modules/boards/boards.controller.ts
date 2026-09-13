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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardCategory } from './entities/board.entity';

@Controller('board')
export class BoardsController {
  private readonly logger = new Logger(BoardsController.name);

  constructor(private readonly boardsService: BoardsService) {}

  @Get('/:ctgy')
  getAllBoard(
    @Param('ctgy') ctgy: BoardCategory,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.boardsService.getAllBoard({ page, limit }, ctgy);
  }

  @Get('/detail/:ctgy/:uuid')
  findOneBoard(
    @Param('ctgy') ctgy: BoardCategory,
    @Param('uuid') uuid: string,
  ) {
    return this.boardsService.findOneBoard(uuid);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  insertBoard(
    @Body() createBoardDto: CreateBoardDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.boardsService.insertBoard(createBoardDto, files);
  }

  @Patch('/update/:ctgy/:uuid')
  @UseInterceptors(AnyFilesInterceptor())
  updateBoard(@Param('ctgy') ctgy: BoardCategory, @Param('uuid') uuid: string) {
    return this.boardsService.updateBoard(ctgy, uuid);
  }
}
