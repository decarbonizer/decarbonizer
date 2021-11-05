import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common';
import { User } from './user.schema';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }

  async getByEmail(email: string): Promise<User | undefined | null> {
    const doc = await this.model.findOne({ email });
    return doc?.toObject();
  }
}
