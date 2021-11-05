import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User, UserCreate, SafeUser, UserRoles } from './user.schema';
import { compareSync, hashSync } from 'bcrypt';
import { authHashRounds } from '../constants';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: string) {
    return this.stripDangerousProps(await this.userRepository.getById(id));
  }

  async getByCredentials(email: string, password: string) {
    const user = await this.userRepository.getByEmail(email);

    if (user && compareSync(password, user.passwordHash)) {
      return this.stripDangerousProps(user);
    }

    return undefined;
  }

  async create(userCreate: UserCreate) {
    const newUser = await this.userRepository.add({
      ...userCreate,
      passwordHash: hashSync(userCreate.password, authHashRounds),
      roles: [UserRoles.User],
    });
    return this.stripDangerousProps(newUser);
  }

  private stripDangerousProps(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
