import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner.entity';
import * as bcrypt from 'bcrypt';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import * as nodemailer from 'nodemailer';

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
    const result = await this.OwnerRepository.softDelete({ id: ownerID });
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
    console.log(owner);
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
}
