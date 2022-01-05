import { Injectable } from '@nestjs/common';
import { ActionPlanSeeder } from '../action-plan/action-plan.seeder';
import { BulbSeeder } from '../bulbs/bulb.seeder';
import { CompanySeeder } from '../companies/company.seeder';
import { EnergyFormSeeder } from '../energy-form/energy-form.seeder';
import { HeatingTypeSeeder } from '../heating-types/heating-type.seeder';
import { MessageSeeder } from '../message/message.seeder';
import { RealEstateSeeder } from '../real-estate/real-estate.seeder';
import { SurveyAnswerSeeder } from '../survey-answer/survey-answer.seeder';
import { UserSeeder } from '../user/user.seeder';
import { DbSeeder } from './db.seeder';

@Injectable()
export class DbSeedingService {
  constructor(
    private readonly messageSeeder: MessageSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly realEstateSeeder: RealEstateSeeder,
    private readonly energyFormSeeder: EnergyFormSeeder,
    private readonly bulbSeeder: BulbSeeder,
    private readonly heatingTypeSeeder: HeatingTypeSeeder,
    private readonly surveyAnswerSeeder: SurveyAnswerSeeder,
    private readonly actionPlanSeeder: ActionPlanSeeder,
    private readonly companySeeder: CompanySeeder,
  ) {}

  async seedDb() {
    const seeders: Array<DbSeeder> = [
      this.messageSeeder,
      this.userSeeder,
      this.realEstateSeeder,
      this.energyFormSeeder,
      this.bulbSeeder,
      this.heatingTypeSeeder,
      this.surveyAnswerSeeder,
      this.actionPlanSeeder,
      this.companySeeder,
    ];

    for (const seeder of seeders) {
      await seeder.drop();
    }

    for (const seeder of seeders) {
      await seeder.seed();
    }
  }
}
