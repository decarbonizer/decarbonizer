import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from './app-config';
import { AuthModule } from './auth/auth.module';
import { BulbModule } from './bulbs/bulb.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        uri: configService.get('DB_CONNECTION_STRING'),
      }),
    }),
    AuthModule,
    BulbModule,
    UserModule,
    MessageModule,
  ],
})
export class AppModule {}
