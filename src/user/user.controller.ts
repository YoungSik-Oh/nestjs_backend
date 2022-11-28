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
import { UserService } from './user.service';
import { UserRegistVo } from './vo/user-regist.vo';
import { UserUpdateVo } from './vo/user-update.vo';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  getAllUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.userService.getAllUsers({ page, limit });
  }

  @Get('/:uuid')
  findOneUse(@Param('uuid') uuid: string) {
    return this.userService.fildOneUser(uuid);
  }

  @Post()
  createUser(@Body() registData: UserRegistVo) {
    return this.userService.createUser(registData);
  }

  @Patch('/update_user/:uuid')
  updateUser(@Param('uuid') uuid: string, @Body() updateData: UserUpdateVo) {
    return this.userService.updateUser(uuid, updateData);
  }

  @Delete('/delete/:uuid')
  deleteUser(@Param('uuid') uuid: string) {
    return this.userService.deleteUser(uuid);
  }
}
