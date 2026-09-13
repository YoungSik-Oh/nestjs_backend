import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.usersService.getAllUsers({ page, limit });
  }

  @Get('/:uuid')
  findOneUser(@Param('uuid') uuid: string) {
    return this.usersService.findOneUser(uuid);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/update_user/:uuid')
  updateUser(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(uuid, updateUserDto);
  }

  @Delete('/delete/:uuid')
  deleteUser(@Param('uuid') uuid: string) {
    return this.usersService.deleteUser(uuid);
  }
}
