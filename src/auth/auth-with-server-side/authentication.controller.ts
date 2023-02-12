import {
	Req,
	Controller,
	HttpCode,
	Post,
	UseGuards,
	UseInterceptors,
	Get,
} from '@nestjs/common';
import RequestWithUser from '../models/requestsWithUser';
import { LogInWithCredentialsGuard } from '../jwt/logIn-with-credentials.guard';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { User } from '../user.schema';
import { Public } from 'src/utils/public.decorator';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('authentication')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthenticationController {
	constructor(
		private authService: AuthService,
		private configService: ConfigService,
	) {}

	@Public()
	@HttpCode(200)
	@UseGuards(LogInWithCredentialsGuard)
	@Post('log-in')
	async logIn(@Req() request: RequestWithUser) {
		const accessToken = this.authService.getCookieWithJwtAccessToken(
			request.user,
		);
		const accessTokenCookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get(
			'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
		)}`;

		// ToDo: cash this token in redis instead of send in cookie.
		request.res.setHeader('Set-Cookie', accessTokenCookie);
		return request.user;
	}

	@HttpCode(200)
	@Get()
	async authenticate(@Req() request: RequestWithUser) {
		return request.user;
	}

	@HttpCode(200)
	@Post('log-out')
	async logOut(@Req() request: RequestWithUser) {
		request.logout(err => {
			if (err) {
				console.log('invalid logout', err);
			}
		});

		request.session.cookie.maxAge = 0;
	}
}
