import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyAnswer, SurveyAnswerSchema } from './survey-answer.schema';
import { SurveyAnswerController } from './survey-answer.controller';
import { SurveyAnswerService } from './survey-answer.service';
import { SurveyAnswerRepository } from './survey-answer.repository';
import { SurveyAnswerSeeder } from './survey-answer.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SurveyAnswer.name,
        schema: SurveyAnswerSchema,
      },
    ]),
  ],
  controllers: [SurveyAnswerController],
  providers: [SurveyAnswerService, SurveyAnswerRepository, SurveyAnswerSeeder],
  exports: [SurveyAnswerSeeder],
})
export class SurveyAnswerModule {}
