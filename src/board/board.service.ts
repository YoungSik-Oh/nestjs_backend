import {
  Injectable,
  Logger,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Board, BaordCategory } from 'src/@database/entity/board.entity';
import { Repository } from 'typeorm';
import { BoardRegistVo } from './vo/board-regist.vo';

@Injectable()
export class BoardService {
  private readonly logger = new Logger(BoardService.name);

  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  async getAllBoard(
    pagination: IPaginationOptions,
    ctgy: BaordCategory,
  ): Promise<Pagination<Board>> {
    return paginate<Board>(this.boardRepository, pagination, {
      where: {
        category: ctgy,
      },
    });
  }

  async hitadd(uuid: string): Promise<Board> {
    const bId = await this.boardRepository
      .findOneByOrFail({ uuid })
      .catch(() => {
        throw new NotFoundException(`조회된 게시글이 없습니다.`);
      });
    return this.boardRepository.save({ ...bId, hit: +bId.hit + 1 });
  }

  async findOneBoard(uuid: string, ctgy: BaordCategory): Promise<Board> {
    await this.hitadd(uuid);
    return this.boardRepository.findOneByOrFail({ uuid }).catch(() => {
      throw new NotFoundException(`조회된 게시글이 없습니다. id: ${uuid}`);
    });
  }

  async insertBoard(
    registData: BoardRegistVo,
    files: Express.Multer.File[],
  ): Promise<any> {
    const { category, contents, title, writerID } = registData;

    let orginName = '';

    files?.forEach((file) => {
      const {
        fieldname, // 'imageMain',
        originalname, // 'photo.png',
        // encoding, // '7bit',
        mimetype, // 'image/png',
        // destination, // 'public',
        filename, // '1f5b3d6f-cfcb-4378-9d50-fa56421208ae.png',
        // path, // 'public/1f5b3d6f-cfcb-4378-9d50-fa56421208ae.png',
        // size, // 3044
      } = file;
      // const [filetype] = mimetype.split('/')
      orginName = originalname;
    });

    const saveData = this.boardRepository.create({
      category: category,
      contents: contents,
      title: title,
      registAt: new Date().toJSON(),
      writer: writerID,
      hit: 0,
      file: orginName,
      file_registAt: new Date().toJSON(),
    });

    return this.boardRepository.save(saveData);
  }

  async updateBoard(ctgy: BaordCategory, uuid?: string): Promise<Board> {
    const savedBoard = await this.boardRepository
      .findOneByOrFail({ uuid })
      .catch(() => {
        throw new NotFoundException(`조회된 게시글이 없습니다.`);
      });

    return savedBoard;
  }
}
