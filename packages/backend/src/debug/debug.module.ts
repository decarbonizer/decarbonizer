import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { DbSeedingService } from './db-seeding.service';
import { DebugController } from './debug.controller';

@Module({
  controllers: [DebugController],
  providers: [DbSeedingService],
  imports: [UserModule],
})
export class DebugModule {}
