// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
// import { AuthCredentialDto } from './dto/auth.dto';
// import { Role } from './models/role.enum';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//   canActivate(context: ExecutionContext): boolean {
//     const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()]);

//     console.log('requireRoles', requireRoles);

//     if (!requireRoles) {
//       return true;
//     }
//     const { body } = context.switchToHttp().getRequest();

//     console.log('body', body);
//     // const user: AuthCredentialDto = {
//     //   username: 'kjsaldkj',
//     //   password: 'kLAJDLKa',
//     //   roles: [Role.ADMIN],
//     // };
//     return requireRoles.some(role => body.roles.includes(role));
//   }
// }

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
    private reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { body } = context.switchToHttp().getRequest();
    const username = body.username;

    const freshUser = await this.usersRepository.findOneBy({ username });

    await console.log('freshUser', freshUser);
    console.log('body', body);

    return requiredRoles.some((role) => freshUser.roles?.includes(role));
  }
}
