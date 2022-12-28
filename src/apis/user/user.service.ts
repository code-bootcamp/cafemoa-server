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

    function AgeCalculate(personalNumber) {
      if (personalNumber.includes('-')) {
        personalNumber = personalNumber.replace('-', '');
      }

      const today = new Date(); // 현재 시간

      // let personalFront = personalNumber.substr(0, 6); // 주민번호 앞자리
      const personalBackFirstValue = personalNumber.substr(6, 1); // 주민번호뒷자리 첫 문자열(2000년생 이전 인지 이후 인지 확인)

      let age = 0;
      let birthDate;
      let personalYear;

      const personalMonth = personalNumber.substr(2, 2); // 월
      const personalDate = personalNumber.substr(4, 2); // 일

      let monthCheck = 0;

      if (personalBackFirstValue == 1 || personalBackFirstValue == 2) {
        // 2000년생 이전
        personalYear = '19' + personalNumber.substr(0, 2); // 년도

        birthDate = new Date(personalYear, personalMonth - 1, personalDate);

        // 현재 년도 - 태어난 년도
        age = today.getFullYear() - birthDate.getFullYear();

        // 현재 월 - 태어난 월
        monthCheck = today.getMonth() - birthDate.getMonth();

        // 생일이 지나지 않았다면
        if (
          monthCheck < 0 ||
          (monthCheck === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
      } else {
        // 2000년생 이후
        personalYear = '20' + personalNumber.substr(0, 2); // 주민번호 앞자리

        birthDate = new Date(personalYear, personalMonth - 1, personalDate);

        age = today.getFullYear() - birthDate.getFullYear();

        monthCheck = today.getMonth() - birthDate.getMonth();

        if (
          monthCheck < 0 ||
          (monthCheck === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
      }

      const strAge = age.toString();

      if (strAge.length === 1) {
        return '10대 이하';
      } else {
        return strAge[0] + '0대';
      }
    }

    const age = AgeCalculate(personalNumber);

    const hashedPassword = await bcrypt.hash(password, 10);
    const maskingPersonalNumber = personalNumber.slice(0, 8).padEnd(14, '*');

    return this.userRepository.save({
      password: hashedPassword,
      personalNumber: maskingPersonalNumber,
      email,
      age,
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

  async changeUserPwd({ password, email }): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    const result = await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });
    return result ? true : false;
  }
}
