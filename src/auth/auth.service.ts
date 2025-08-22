import { User } from 'src/common/decorators/user.decorator';
import {
  HttpCode,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'node_modules/bcryptjs';
import { REDIS_CLIENT } from 'src/common/constants/redis.constants';
import * as redis from 'redis';
import {
  ERROR_INVALID_CREDENTIALS,
  ERROR_USER_NOT_FOUND,
  TOKEN_INVALID_OR_EXPIRED,
} from 'src/common/constants/messages.constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @Inject(REDIS_CLIENT) private redisClient: redis.RedisClientType,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user || !user.password) {
      throw new NotFoundException(ERROR_USER_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException(ERROR_INVALID_CREDENTIALS);
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    //access token
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: Number(process.env.JWT_EXPIRES),
    });
    await this.redisClient.setEx(
      `auth:token:${user.id}`,
      Number(process.env.JWT_EXPIRES),
      token,
    );

    //refresh token
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: Number(process.env.JWT_REFRESH_EXPIRES),
      },
    );
    await this.redisClient.setEx(
      `auth:refresh:${user.id}`,
      Number(process.env.JWT_REFRESH_EXPIRES),
      refreshToken,
    );

    return {
      access_token: token,
      refresh_token: refreshToken,
    };
  }

  @HttpCode(204)
  async signOut(@User('sub') userId: number) {
    await this.redisClient.del(`auth:token:${userId}`);
    await this.redisClient.del(`auth:refresh:${userId}`);
  }

  async refreshToken(@User('sub') userId: number, refreshToken: string) {
    const redisToken = await this.redisClient.get(`auth:refresh:${userId}`);
    if (!redisToken || redisToken !== refreshToken) {
      throw new UnauthorizedException(TOKEN_INVALID_OR_EXPIRED);
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(ERROR_USER_NOT_FOUND);
    }
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    //access token
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: Number(process.env.JWT_EXPIRES),
    });
    await this.redisClient.setEx(
      `auth:token:${user.id}`,
      Number(process.env.JWT_EXPIRES),
      token,
    );
    return { access_token: token };
  }
}
