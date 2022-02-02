import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseData, BaseDataSchema } from './base-data.schema';
import { BaseDataController } from './base-data.controller';
import { BaseDataService } from './base-data.service';
import { BaseDataRepository } from './base-data.repository';
import { BaseDataSeeder } from './base-data.seeder';
import { RealEstateService } from '../real-estate/real-estate.service';
import { RealEstateRepository } from '../real-estate/real-estate.repository';
import { RealEstate, RealEstateSchema } from '../real-estate/real-estate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BaseData.name,
        schema: BaseDataSchema,
      },
      {
        name: RealEstate.name,
        schema: RealEstateSchema,
      },
    ]),
  ],
  controllers: [BaseDataController],
  providers: [BaseDataService, BaseDataRepository, BaseDataSeeder, RealEstateService, RealEstateRepository],
  exports: [BaseDataSeeder],
})
export class BaseDataModule {}
