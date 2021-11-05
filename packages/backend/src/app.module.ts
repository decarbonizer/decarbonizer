import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from './app-config';
import { AuthModule } from './auth';
import { MessageModule } from './message';
import { UserModule } from './user';

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
    UserModule,
    MessageModule,
  ],
})
export class AppModule {}
