import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseData, BaseDataSchema } from './base-data.schema';
import { ActionPlanController } from './base-data.controller';
import { BaseDataService } from './base-data.service';
import { BaseDataRepository } from './base-data.repository';
import { BaseDataSeeder } from './base-data.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BaseData.name,
        schema: BaseDataSchema,
      },
    ]),
  ],
  controllers: [ActionPlanController],
  providers: [BaseDataService, BaseDataRepository, BaseDataSeeder],
  exports: [BaseDataSeeder],
})
export class BaseDataModule {}
