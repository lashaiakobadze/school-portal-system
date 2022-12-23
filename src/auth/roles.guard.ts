import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './models/role.enum';
import { User } from './user.entity';
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

    console.log('request.user', request.user);

    if (request?.user) {
      const { id } = request?.user;

      const user: User = await this.usersRepository.findOneBy({ id });

      return requiredRoles.some(role => user.roles?.includes(role));
    }

    return false;
  }
}
