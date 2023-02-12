import {
	Req,
	Controller,
	HttpCode,
	Post,
	UseGuards,
	UseInterceptors,
	ClassSerializerInterceptor,
	Get,
} from '@nestjs/common';
import RequestWithUser from '../models/requestsWithUser';
import { LogInWithCredentialsGuard } from '../jwt/logIn-with-credentials.guard';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
	@HttpCode(200)
	@UseGuards(LogInWithCredentialsGuard)
	@Post('log-in')
	async logIn(@Req() request: RequestWithUser) {
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
