import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  PaginationOptions,
} from '../../common/pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllUsers(pagination: PaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, pagination, {});
  }

  async findOneUser(uuid: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { uuid } }).catch(() => {
      throw new NotFoundException('조회된 고객이 없습니다.');
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { userID, name, pwd, email, phone, authority } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(pwd, salt);

    const saveData = this.userRepository.create({
      userID,
      name,
      pwd: hashedPwd,
      email,
      phone,
      authority,
    });
    return this.userRepository.save(saveData);
  }

  async updateUser(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const findUser = await this.findOneUser(uuid);
    const { email, phone, authority, name, pwd } = updateUserDto;
    let hashedPwd = '';
    if (pwd) {
      const salt = await bcrypt.genSalt();
      hashedPwd = await bcrypt.hash(pwd, salt);
    }
    await this.userRepository.update(findUser.uuid, {
      name,
      pwd: pwd ? hashedPwd : findUser.pwd,
      email,
      phone,
      authority,
    });

    return this.findOneUser(uuid);
  }

  async deleteUser(uuid: string): Promise<User> {
    const findUser = await this.findOneUser(uuid);
    return this.userRepository.remove(findUser);
  }
}
