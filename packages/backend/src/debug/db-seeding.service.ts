import { Injectable } from '@nestjs/common';
import { BulbSeeder } from '../bulbs/bulb.seeder';
import { EnergyFormSeeder } from '../energy-form/energy-form.seeder';
import { MessageSeeder } from '../message/message.seeder';
import { RealEstateSeeder } from '../real-estate/real-estate.seeder';
import { SurveyAnswerSeeder } from '../survey-answer/survey-answer.seeder';
import { SurveySeeder } from '../survey/survey.seeder';
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
    private readonly surveySeeder: SurveySeeder,
    private readonly surveyAnswerSeeder: SurveyAnswerSeeder,
  ) {}

  async seedDb() {
    const seeders: Array<DbSeeder> = [
      this.messageSeeder,
      this.userSeeder,
      this.realEstateSeeder,
      this.energyFormSeeder,
      this.bulbSeeder,
      this.surveySeeder,
      this.surveyAnswerSeeder,
    ];

    for (const seeder of seeders) {
      await seeder.drop();
    }

    for (const seeder of seeders) {
      await seeder.seed();
    }
  }
}
