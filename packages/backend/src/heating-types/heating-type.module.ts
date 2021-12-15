import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeatingTypeController } from './heating-type.controller';
import { HeatingTypeRepository } from './heating-type.repository';
import { HeatingType, HeatingTypeSchema } from './heating-type.schema';
import { HeatingTypeSeeder } from './heating-type.seeder';
import { HeatingTypeService } from './heating-type.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HeatingType.name,
        schema: HeatingTypeSchema,
      },
    ]),
  ],
  controllers: [HeatingTypeController],
  providers: [HeatingTypeService, HeatingTypeRepository, HeatingTypeSeeder],
  exports: [HeatingTypeSeeder],
})
export class HeatingTypeModule {}
