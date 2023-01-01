import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import { CafeInformModule } from './apis/cafeInform/cafeInform.module';
import { CategoryModule } from './apis/category/category.module';
import { CommentModule } from './apis/comment/comment.module';
import { OwnerModule } from './apis/owner/owner.module';
import { UserModule } from './apis/user/user.module';
import { UserAuthModule } from './apis/userauth/userauth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAccessStrategy } from './commons/auth/jwt-access.strategy';
import { JwtRefreshStrategy } from './commons/auth/jwt-refresh.strategy';
import * as redisStore from 'cache-manager-redis-store';
import { PickListModule } from './apis/pickList/pickList.module';

import { CouponModule } from './apis/coupon/coupon.module';

import { OwnerAuthModule } from './apis/ownerAuth/ownerAuth.module';
import { CommentImageModule } from './apis/commentImage.ts/commentimage.module';
import { OwnerCommentModule } from './apis/ownercomment/ownercomment.module';

import { FilesUploadModule } from './fileupload/filesupload.module';


@Module({
  imports: [
    OwnerCommentModule,
    CommentImageModule,
    OwnerAuthModule,
    CouponModule,
    PickListModule,
    UserAuthModule,
    UserModule,
    CommentModule,
    CategoryModule,
    OwnerModule,
    CafeInformModule,
    UserModule,
    FilesUploadModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: [
          'http://localhost:3000',
          'https://mydatabase.backkim.shop/graphql',
          'https://backkim.shop',
          'http://localhost:5500',
          'http://localhost:5501',
        ],
        credentials: true,
        exposedHeaders: ['Set-Cookie', 'Cookie'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: [
          'Access-Control-Allow-Headers',
          'Authorization',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
      },
    }),

    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}
