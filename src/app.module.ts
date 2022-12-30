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

@Module({
  imports: [
    UserAuthModule,
    UserModule,
    CommentModule,
    CategoryModule,
    OwnerModule,
    CafeInformModule,
    UserModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
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
      //10.14.81.3
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}
