import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import bcrypt from 'node_modules/bcryptjs';
import { BCRYPT_SALT_ROUNDS } from 'src/common/constants/auth.constants';
import { FilterUserDto } from './dto/filter-user.dto';
import { UserMapper } from './mappers/user.mapper';
import { AdminUserDto } from './dto/user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(filters: FilterUserDto): Promise<AdminUserDto[]> {
    const query: FindOptionsWhere<User> = {};

    if (filters.email) {
      query.email = ILike(`%${filters.email}%`);
    }
    if (filters.username) {
      query.username = ILike(`%${filters.username}%`);
    }
    if (filters.isActive) {
      query.isActive = filters.isActive;
    }

    const pageSize = 3;
    const page = filters.page;

    let users: User[];
    if (page === undefined) {
      users = await this.userRepository.find({ where: query });
    } else {
      users = await this.userRepository.find({
        where: query,
        skip: page * pageSize,
        take: pageSize,
      });
    }
    return users.map((user) => UserMapper.toAdminUserDto(user));
  }

  async create(createUserDto: CreateUserDto, adminId?: number): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_SALT_ROUNDS,
    );
    const newUser = {
      ...createUserDto,
      roles: [Role.Candidate],
      password: hashedPassword,
      isActive: true,
      createdBy: adminId,
    };
    return await this.userRepository.save(newUser);
  }

  async update(id: number, adminId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        BCRYPT_SALT_ROUNDS,
      );
    }

    const updatedUser = { ...user, ...updateUserDto, updatedBy: adminId };
    return await this.userRepository.save(updatedUser);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }

  async softRemove(id: number, adminId: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = false;
    user.updatedBy = adminId;
    return this.userRepository.save(user);
  }

  async restore(id: number, adminId: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = true;
    user.updatedBy = adminId;
    return this.userRepository.save(user);
  }
}
