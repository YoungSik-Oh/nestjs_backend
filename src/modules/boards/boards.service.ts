import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  PaginationOptions,
} from '../../common/pagination';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board, BoardCategory } from './entities/board.entity';

@Injectable()
export class BoardsService {
  private readonly logger = new Logger(BoardsService.name);

  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  async getAllBoard(
    pagination: PaginationOptions,
    ctgy: BoardCategory,
  ): Promise<Pagination<Board>> {
    return paginate<Board>(this.boardRepository, pagination, {
      where: {
        category: ctgy,
      },
    });
  }

  async increaseHit(uuid: string): Promise<Board> {
    const board = await this.boardRepository
      .findOneByOrFail({ uuid })
      .catch(() => {
        throw new NotFoundException(`조회된 게시글이 없습니다.`);
      });
    return this.boardRepository.save({ ...board, hit: +board.hit + 1 });
  }

  async findOneBoard(uuid: string): Promise<Board> {
    await this.increaseHit(uuid);
    return this.boardRepository.findOneByOrFail({ uuid }).catch(() => {
      throw new NotFoundException(`조회된 게시글이 없습니다. id: ${uuid}`);
    });
  }

  async insertBoard(
    createBoardDto: CreateBoardDto,
    files?: Express.Multer.File[],
  ): Promise<Board> {
    const { category, contents, title, writerID } = createBoardDto;

    let originalName = '';
    files?.forEach((file) => {
      originalName = file.originalname;
    });

    const saveData = this.boardRepository.create({
      category,
      contents,
      title,
      writer: { uuid: writerID },
      hit: 0,
      file: originalName,
      file_registAt: new Date(),
    });

    return this.boardRepository.save(saveData);
  }

  async updateBoard(ctgy: BoardCategory, uuid?: string): Promise<Board> {
    const savedBoard = await this.boardRepository
      .findOneByOrFail({ uuid })
      .catch(() => {
        throw new NotFoundException(`조회된 게시글이 없습니다.`);
      });

    return savedBoard;
  }
}
