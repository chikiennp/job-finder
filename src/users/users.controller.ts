import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserEntity } from '../database/entities/user.entity';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(Role.Admin)
  create(@User('sub') adminId: number, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, adminId);
  }

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @User('sub') adminId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, adminId, updateUserDto);
  }

  @Delete(':id/restore')
  restore(@User('sub') adminId: number, @Param('id', ParseIntPipe) id: number) {
    return this.usersService.restore(id, adminId);
  }

  @Delete(':id/softDelete')
  softRemove(
    @User('sub') adminId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.softRemove(id, adminId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
