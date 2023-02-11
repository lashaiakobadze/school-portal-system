import {
	Body,
	Req,
	Controller,
	HttpCode,
	Post,
	UseGuards,
	UseInterceptors,
	ClassSerializerInterceptor,
	Get,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './register.dto';
import { CookieAuthenticationGuard } from './cookieAuthentication.guard';
import RequestWithUser from '../models/requestsWithUser';
import { LogInWithCredentialsGuard } from './logInWithCredentialsGuard';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { User } from '../user.schema';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
// @UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthenticationController {
	constructor(private readonly authenticationService: AuthenticationService) {}

	@Post('register')
	async register(@Body() registrationData: RegisterDto) {
		// console.log('registrationData', registrationData);
		return this.authenticationService.register(registrationData);
	}

	@HttpCode(200)
	@UseGuards(LogInWithCredentialsGuard)
	@Post('log-in')
	async logIn(@Req() request: RequestWithUser) {
		return request.user;
	}

	@HttpCode(200)
	@UseGuards(CookieAuthenticationGuard)
	@Get()
	async authenticate(@Req() request: RequestWithUser) {
		return request.user;
	}

	@HttpCode(200)
	@UseGuards(CookieAuthenticationGuard)
	@Post('log-out')
	async logOut(@Req() request: RequestWithUser) {
		request.logout((err) => {
			if (err) {
				console.log('invalid logout', err);
			}
		});

		request.session.cookie.maxAge = 0;
	}
}
