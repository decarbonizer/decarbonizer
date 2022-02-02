import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RealEstate, RealEstateSchema } from './real-estate.schema';
import { RealEstateController } from './real-estate.controller';
import { RealEstateService } from './real-estate.service';
import { RealEstateRepository } from './real-estate.repository';
import { RealEstateSeeder } from './real-estate.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RealEstate.name,
        schema: RealEstateSchema,
      },
    ]),
  ],
  controllers: [RealEstateController],
  providers: [RealEstateService, RealEstateRepository, RealEstateSeeder],
  exports: [RealEstateSeeder, RealEstateService, RealEstateRepository],
})
export class RealEstateModule {}
