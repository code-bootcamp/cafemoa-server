import {
  // CACHE_MANAGER,
  // Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  IUserAuthloginService,
  IUserAuthServiceGetAccessToken,
  IUserAuthServiceLogout,
} from './interfaces/auth-service.interface';
// import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
// import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly userService: UserService, // @Inject(CACHE_MANAGER) // private readonly cacheManager: Cache,
  ) {}

  async login({ email, password, context }: IUserAuthloginService) {
    const user = await this.userService.find({ email });

    // 존재하는 유저인지 검증
    if (!user) {
      throw new UnprocessableEntityException('회원이 존재하지 않습니다.');
    }

    // 비밀번호 틀렸을때
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('암호가 틀렸습니다.');
    }

    const refreshToken = await this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
    );

    const res = context.res;
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '60s' },
    );
  }

  getAccessToken({ user }: IUserAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '60s' },
    );
  }
}
