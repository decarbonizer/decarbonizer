import { Module } from '@nestjs/common';
import { ActionPlanModule } from '../action-plan/action-plan.module';
import { BaseDataModule } from '../base-data/base-data.module';
import { BulbModule } from '../bulbs/bulb.module';
import { CompanyModule } from '../companies/company.module';
import { EnergyFormModule } from '../energy-form/energy-form.module';
import { HeatingTypeModule } from '../heating-types/heating-type.module';
import { MessageModule } from '../message/message.module';
import { RealEstateModule } from '../real-estate/real-estate.module';
import { SurveyAnswerModule } from '../survey-answer/survey-answer.module';
import { UserModule } from '../user/user.module';
import { DbSeedingService } from './db-seeding.service';
import { DebugController } from './debug.controller';

@Module({
  controllers: [DebugController],
  providers: [DbSeedingService],
  imports: [
    MessageModule,
    UserModule,
    BulbModule,
    HeatingTypeModule,
    EnergyFormModule,
    RealEstateModule,
    SurveyAnswerModule,
    ActionPlanModule,
    CompanyModule,
    BaseDataModule,
  ],
})
export class DebugModule {}
