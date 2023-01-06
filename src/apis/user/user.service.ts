import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUserServiceCreate,
  IUserServiceUpdate,
} from './interfaces/user-service.interface';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async create({ createUserInput }: IUserServiceCreate): Promise<User> {
    const { password, email, personalNumber, ...User } = createUserInput;

    const is_Valid = await this.userRepository.findOne({ where: { email } });

    if (is_Valid) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const date = new Date();
    const year = date.getFullYear();
    const yearend = Number(String(year).slice(2, 4));
    const personalfirst = Number(personalNumber.slice(0, 2));
    let age;

    if (personalfirst <= yearend) {
      age = '20' + personalfirst;
      age = year - Number(age);
    } else {
      age = '19' + personalfirst;
      age = year - Number(age);
    }

    if (String(age).length === 1) {
      age = '10대 이하';
    } else {
      age = String(age)[0] + '0대';
    }

    return await this.userRepository.save({
      password: hashedPassword,
      personalNumber,
      email,
      age,
      ...User,
    });
  }

  async emailVerify({ email }) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new ConflictException('이미 등록된 회원입니다');

    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
    const EMAIL_SENDER = process.env.EMAIL_SENDER;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });
    const verifyNum = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      '0',
    );

    await transporter.sendMail({
      from: EMAIL_SENDER,
      to: email,
      subject: '[카페모아] 이메일 인증번호가 발급되었습니다.',
      html: `
      <html>
        <body>
            <div style ="display: flex; flex-direction: column; align-items: center;">
                <div style = "width: 500px;">
                    <div>인증번호: ${verifyNum}</div>
                </div>
            </div>
        </body>
    </html>`,
    });

    return verifyNum;
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

  async findCouponUser({ name, page }) {
    if (name.length === 1) {
      const firstname = name[0];
      return await this.userRepository
        .createQueryBuilder()
        .where('name Like :name', { name: `${firstname}%%` })
        .take(10)
        .skip(10 * (page - 1))
        .getMany();
    } else if (name.length === 2) {
      const firstname = name[0];
      const secondname = name[1];
      return await this.userRepository
        .createQueryBuilder()
        .where('name Like :name', { name: `${firstname}%%` })
        .andWhere('name Like :secondname', { secondname: `%${secondname}%` })
        .take(10)
        .skip(10 * (page - 1))
        .getMany();
    } else if (name.length === 3) {
      const firstname = name[0];
      const secondname = name[1];
      const thirdname = name[2];

      return await this.userRepository
        .createQueryBuilder()
        .where('name Like :name', { name: `${firstname}%%` })
        .andWhere('name Like :secondname', { secondname: `%${secondname}%` })
        .andWhere('name Like :thirdname', { thirdname: `%%${thirdname}` })
        .take(10)
        .skip(10 * (page - 1))
        .getMany();
    }
  }

  async update({
    updateUserInput,
    context,
  }: IUserServiceUpdate): Promise<User> {
    const userId = context.req.user.id;
    let { password, ...user } = updateUserInput;

    const result = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    return await this.userRepository.save({
      ...result,
      password,
      ...user,
    });
  }

  async delete({ userId }): Promise<boolean> {
    const result = await this.userRepository.delete({ id: userId });
    return result.affected ? true : false;
  }

  async findUserPwd({ email }) {
    const password = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      '0',
    );
    const user = await this.userRepository.findOne({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
    const EMAIL_SENDER = process.env.EMAIL_SENDER;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: EMAIL_SENDER,
      to: email,
      subject: '[카페모아] 임시비밀번호가 발급되었습니다.',
      html: `
      <html>
        <body>
            <div style ="display: flex; flex-direction: column; align-items: center;">
                <div style = "width: 500px;">
                    <h1>${user.name}님 임시비밀번호가 발급되었습니다.</h1>
                    <hr />
                    <div>이름: ${user.name}</div>
                    <div>임시비밀번호: ${password}</div>
                </div>
            </div>
        </body>
    </html>`,
    });

    return '메일이 전송되었습니다.';
  }
}
