import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserIdPipe implements PipeTransform<string, string> {
  constructor(private authService: AuthService) {}

  transform(value: string) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Invalid user ID.');
    }

    return value === 'me' ? this.authService.getCurrentUser()._id! : value;
  }
}
