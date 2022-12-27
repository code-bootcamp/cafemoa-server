import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeInformResolver } from './cafeInform.resolver';
import { CafeInformService } from './cafeInform.service';
import { CafeInform } from './entities/cafeInform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CafeInform])],
  providers: [CafeInformResolver, CafeInformService],
})
export class CafeInformModule {}
