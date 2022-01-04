import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { authHashRounds } from '../constants';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { UserRepository } from './user.repository';
import { User, UserRoles } from './user.schema';

@Injectable()
export class UserSeeder extends DefaultDbSeeder<User> {
  constructor(userRepository: UserRepository) {
    super(userRepository);
  }

  protected override getSeed(): Array<User> {
    return [
      {
        _id: '00000000-0000-0000-0000-000000000000',
        email: 'user@decarbonizer.com',
        roles: [UserRoles.User],
        passwordHash: hashSync('User123', authHashRounds),
        companyId: 'Capgemini',
      },
    ];
  }
}
