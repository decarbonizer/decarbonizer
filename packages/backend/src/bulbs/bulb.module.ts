import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bulb, BulbSchema } from './bulb.schema';
import { BulbController } from './bulb.controller';
import { BulbService } from './bulb.service';
import { BulbRepository } from './bulb.repository';
import { BulbSeeder } from './bulb.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bulb.name,
        schema: BulbSchema,
      },
    ]),
  ],
  controllers: [BulbController],
  providers: [BulbService, BulbRepository, BulbSeeder],
  exports: [BulbSeeder],
})
export class BulbModule {}
