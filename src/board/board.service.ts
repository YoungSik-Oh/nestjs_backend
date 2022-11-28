import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/@database/entity/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  private readonly logger = new Logger(BoardService.name);

  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}
}
