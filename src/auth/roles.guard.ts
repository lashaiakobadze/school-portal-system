import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './models/role.enum';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from './user.repository';
import { User } from './user.schema';
import { AuthConfig } from 'src/utils/auth-config.enum';

const ROLES_KEY = 'roles';
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private usersRepository: UserRepository,
		private configService: ConfigService,
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
			let roles: string[] = [];

			/**
			 * It's more security way to get user info from token.
			 */
			// const authConfig: AuthConfig = this.configService.get('AUTH_CONFIG');
			// const secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
			// let accessToken: string = null; 

			// if (authConfig === AuthConfig.AUTH_WITH_COOKIE) {
			//  // ToDo: get this token from redis with session ID.
			// 	accessToken = request
			// 		?.get('cookie')
			// 		?.replace('Authentication=', '')
			// 		.trim();
			// } else if (authConfig === AuthConfig.AUTH_WITH_TOKEN) {
			// 	accessToken = request
			// 		?.get('authorization')
			// 		?.replace('Bearer', '')
			// 		.trim();
			// }

			// const decodeToken = (token: string): any => {
			// 	try {
			// 		return jwt.verify(token, secret);
			// 	} catch (err) {
			// 		return null;
			// 	}
			// };

			// const decodedToken = decodeToken(accessToken);
			// roles = decodedToken?.roles;
			roles = request?.user.roles;

			return requiredRoles.some(role => roles?.includes(role));
		}

		return false;
	}
}
