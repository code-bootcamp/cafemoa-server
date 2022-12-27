import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUserServiceCreate,
  IUserServiceUpdate,
} from './interfaces/user-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ createUserInput }: IUserServiceCreate): Promise<User> {
    const { password, email, personalNumber, ...User } = createUserInput;

    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new ConflictException('이미 등록된 회원입니다');

    const hashedPassword = await bcrypt.hash(password, 10);
    const maskingPersonalNumber = personalNumber.slice(0, 8).padEnd(14, '*');

    return this.userRepository.save({
      password: hashedPassword,
      personalNumber: maskingPersonalNumber,
      email,
      ...User,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({});
  }

  async find({ email }): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async update({ updateUserInput }: IUserServiceUpdate): Promise<User> {
    const { password, email, ...left } = updateUserInput;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.save({
      ...user,
      password: hashedPassword,
      ...left,
    });
  }

  async delete({ userId }): Promise<boolean> {
    const result = await this.userRepository.softDelete({ id: userId });
    return result.affected ? true : false;
  }
}
