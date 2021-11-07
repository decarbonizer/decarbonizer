import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from './app-config';
import { AuthModule } from './auth/auth.module';
import { BulbModule } from './bulbs/bulb.module';
import { DebugModule } from './debug/debug.module';
import { EnergyFormModule } from './energy-type/energy-form.module';
import { MessageModule } from './message/message.module';
import { RealEstateModule } from './real-estate/real-estate.module';
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
    DebugModule,
    EnergyFormModule,
    MessageModule,
    UserModule,
    RealEstateModule,
  ],
})
export class AppModule {}
