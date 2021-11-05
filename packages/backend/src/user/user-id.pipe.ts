import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

/**
 * A pipe which, when applied to a string parameter, checks whether that parameter is the special
 * "me" value and, if so, transforms that value into the ID of the currently signed in user.
 */
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
