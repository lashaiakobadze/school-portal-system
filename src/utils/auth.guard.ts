import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthConfig } from './auth-config.enum';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
	constructor(
		private readonly configService: ConfigService,
		private reflector: Reflector,
	) {
		super();
	}

	authConfig: AuthConfig = this.configService.get('AUTH_CONFIG');

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride('isPublic', [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) return true;

		if (this.authConfig === AuthConfig.AUTH_WITH_COOKIE) {
			const request = context.switchToHttp().getRequest();
			return request.isAuthenticated();
		} else if (this.authConfig === AuthConfig.AUTH_WITH_TOKEN) {
			return super.canActivate(context);
		}
	}
}
