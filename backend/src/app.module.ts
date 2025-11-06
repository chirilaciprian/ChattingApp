import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { Message } from './message/entities/message.entity';
import { Conversation } from './conversation/entities/conversation.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'chattingapp',
      entities: [User, Message, Conversation],
      synchronize: true,
    }),
    UserModule,
    MessageModule,
    ConversationModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
