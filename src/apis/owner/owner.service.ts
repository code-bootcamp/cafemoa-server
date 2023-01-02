import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner.entity';
import * as bcrypt from 'bcrypt';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import * as nodemailer from 'nodemailer';
import * as coolsms from 'coolsms-node-sdk';
import { SchemaTextFieldPhonetics } from 'redis';
const mysms = coolsms.default;
@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private readonly OwnerRepository: Repository<Owner>,

    @InjectRepository(CafeInform)
    private readonly cafeInformRepository: Repository<CafeInform>,
  ) {}

  async findAll() {
    return this.OwnerRepository.find({
      relations: ['cafeInform'],
    });
  }

  async findOne({ ownerID }) {
    const result = await this.OwnerRepository.findOne({
      where: {
        id: ownerID,
      },
    });
    if (result) {
      return result;
    } else {
      throw new ConflictException('존재하지 않는 아이디입니다.');
    }
  }

  async delete({ ownerID }) {
    const result = await this.OwnerRepository.delete({ id: ownerID });
    return result.affected ? true : false;
  }

  async create({ createOwnerInput }) {
    const { password, ownerPassword, ...owner } = createOwnerInput;

    const result = await this.OwnerRepository.findOne({
      where: {
        email: owner.email,
      },
    });
    if (result) {
      throw new ConflictException('이미 존재하는 회원입니다.');
    }

    const Password = await bcrypt.hash(password, 10);
    const OwnerPassword = await bcrypt.hash(ownerPassword, 10);

    return this.OwnerRepository.save({
      ...owner,
      password: Password,
      ownerPassword: OwnerPassword,
    });
  }

  async update({ updateOwnerInput, ownerID }) {
    let { password, ownerPassword, ...owner } = updateOwnerInput;
    const result = await this.OwnerRepository.findOne({
      where: {
        id: ownerID,
      },
    });
    if (password) {
      password = await bcrypt.hash(password, 10);
    }
    if (ownerPassword) {
      ownerPassword = await bcrypt.hash(ownerPassword, 10);
    }

    return this.OwnerRepository.save({
      ...result,
      password,
      ownerPassword,
      ...owner,
    });
  }

  async emailPassword({ email }) {
    const password = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      '0',
    );
    const owner = await this.OwnerRepository.findOne({
      where: {
        email,
      },
    });
    if (!owner) {
      throw new ConflictException('이메일을 확인해주세요');
    }
    const Password = await bcrypt.hash(password, 10);
    await this.OwnerRepository.save({
      ...owner,
      password: Password,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: '[카페모아] 임시비밀번호가 발급되었습니다.',
      html: `
      <html>
        <body>
            <div style ="display: flex; flex-direction: column; align-items: center;">
                <div style = "width: 500px;">
                    <h1>${owner.name}님 임시비밀번호가 발급되었습니다.</h1>
                    <hr />
                    <div>이름: ${owner.name}</div>
                    <div>임시비밀번호: ${password}</div>
                </div>
            </div>
        </body>
    </html>`,
    });

    return '메일이 전송되었습니다.';
  }

  async sendToken({ email }) {
    const owner = await this.OwnerRepository.findOne({
      where: {
        email,
      },
    });
    if (owner) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: '[카페모아] 인증번호가 발급되었습니다.',
      html: `
      <html>
        <body>
            <div style ="display: flex; flex-direction: column; align-items: center;">
                <div style = "width: 500px;">
                    <h1>인증번호가 발급되었습니다.</h1>
                    <hr />
                    
                    <div>인증번호: ${token}</div>
                </div>
            </div>
        </body>
    </html>`,
    });

    return token;
  }

  async sendTokenToSMS({ phone }) {
    const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    const messageService = new mysms(
      process.env.SMS_KEY,
      process.env.SMS_SECRET,
    );

    const result = await messageService.sendOne({
      to: phone,
      from: process.env.SMS_SENDER,
      text: `안녕하세요 요청하신 인증번호는 ${token} 입니다.`,
      autoTypeDetect: true,
    });
    return token;
  }
}
