import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from './survey.schema';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { SurveyRepository } from './survey.repository';
import { SurveySeeder } from './survey.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Survey.name,
        schema: SurveySchema,
      },
    ]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService, SurveyRepository, SurveySeeder],
  exports: [SurveySeeder],
})
export class SurveyModule {}
