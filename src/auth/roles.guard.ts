import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './models/role.enum';
import { User } from './user.schema';
import { UserRepository } from './user.repository';

const ROLES_KEY = 'roles';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private usersRepository: UserRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = await context.switchToHttp().getRequest();

    if (request?.user) {
      const { id } = request?.user;

      const user: User = await this.usersRepository.getUserById(id);

      return requiredRoles.some(role => user.roles?.includes(role));
    }

    return false;
  }
}
