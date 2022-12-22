import { SetMetadata } from '@nestjs/common';
import { Role } from '../models/role.enum';

const ROLES_KEY = 'roles';

export const HasRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
