import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from './company.controller';
import { CompanyRepository } from './company.repository';
import { Company, CompanySchema } from './company.schema';
import { CompanySeeder } from './company.seeder';
import { CompanyService } from './company.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, CompanySeeder],
  exports: [CompanySeeder],
})
export class CompanyModule {}
