import { SetMetadata } from '@nestjs/common';
import { UserRoles } from './user.schema';

export const rolesKey = 'roles';

/**
 * Declares that the endpoint requires the specified user roles.
 * @param roles The required user role(s).
 */
export const Roles = (...roles: Array<UserRoles>) => SetMetadata(rolesKey, roles);
