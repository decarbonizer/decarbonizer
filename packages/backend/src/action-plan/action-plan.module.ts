import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActionPlan, ActionPlanSchema } from './action-plan.schema';
import { ActionPlanController } from './action-plan.controller';
import { ActionPlanService } from './action-plan.service';
import { ActionPlanRepository } from './action-plan.repository';
import { ActionPlanSeeder } from './action-plan.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ActionPlan.name,
        schema: ActionPlanSchema,
      },
    ]),
  ],
  controllers: [ActionPlanController],
  providers: [ActionPlanService, ActionPlanRepository, ActionPlanSeeder],
  exports: [ActionPlanSeeder],
})
export class ActionPlanModule {}
