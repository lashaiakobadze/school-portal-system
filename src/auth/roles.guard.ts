import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './models/role.enum';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private usersRepository: UserRepository, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true;
    }

    const { body } = context.switchToHttp().getRequest();
    const creatorId = body.creatorId;
    const creatorUser: User = await this.usersRepository.findOneBy({ id: creatorId });

    let data =  '';
    const req = context.switchToHttp().getRequest();
    console.log(data ? req.headers[data] : req.headers);

    // console.log('req', req);

    console.log('body', body);
    console.log('creatorUser', creatorUser);

    if (!creatorId || !creatorUser) {
      throw new BadRequestException('Something bad happened', { cause: new Error(), description: "Creator isn't correct" });
    }

    return requiredRoles.some(role => creatorUser.roles?.includes(role));
  }
}
