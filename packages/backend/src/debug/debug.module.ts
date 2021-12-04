import { Module } from '@nestjs/common';
import { ActionPlanModule } from '../action-plan/action-plan.module';
import { ActionPlanSeeder } from '../action-plan/action-plan.seeder';
import { BulbModule } from '../bulbs/bulb.module';
import { EnergyFormModule } from '../energy-form/energy-form.module';
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
    EnergyFormModule,
    RealEstateModule,
    SurveyAnswerModule,
    ActionPlanModule,
  ],
})
export class DebugModule {}
