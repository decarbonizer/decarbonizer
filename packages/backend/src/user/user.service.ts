import { UserRepository } from './user.repository';
import { User, UserCreate, SafeUser, UserRoles } from './user.schema';
import { hashSync } from 'bcrypt';
import { authHashRounds } from '../constants';
import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => UserService)) private authService: AuthService,
  ) {}

  async getById(id: string) {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser._id === id) {
      return this.stripDangerousProps(currentUser);
    }

    throw new ForbiddenException();
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
