import { Injectable } from '@nestjs/common';
import { UserSeeder } from '../user/user.seeder';
import { DbSeeder } from './db.seeder';

@Injectable()
export class DbSeedingService {
  constructor(private readonly userSeeder: UserSeeder) {}

  async seedDb() {
    const seeders: Array<DbSeeder> = [this.userSeeder];

    for (const seeder of seeders) {
      await seeder.drop();
    }

    for (const seeder of seeders) {
      await seeder.seed();
    }
  }
}
