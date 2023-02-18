import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Patch,
	Post,
	Put,
	Req,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { User } from './user.schema';

import { HasRoles } from './decorators/roles.decorator';
import { GetUser } from './decorators/get-user.decorator';

import { RolesGuard } from './roles.guard';
import JwtRefreshGuard from './jwt/jwt-refresh.guard';

import RequestWithUser from './models/requestsWithUser';
import { SignupInputs } from './models/signup.inputs';
import { Role } from './models/role.enum';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordInputs } from './models/reset-password.inputs';
import { ChangeUserStatusDto } from './dto/change-status.dto';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { LogInWithCredentialsGuard } from './jwt/logIn-with-credentials.guard';
import { Public } from 'src/utils/public.decorator';
import { hasRole } from './decorators/has-role.decorator';

@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@HttpCode(200)
	@UseGuards(LogInWithCredentialsGuard)
	@Post('log-in')
	async logIn(@Req() request: RequestWithUser) {
		const { user } = request;
		const accessTokenCookie =
			this.authService.getCookieWithJwtAccessToken(user);

		const refreshToken = this.authService.getCookieWithJwtRefreshToken(user);

		await this.authService.setCurrentRefreshToken(refreshToken, user);

		return {
			accessTokenCookie,
			refreshToken,
		};
	}

	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	refresh(@Req() request: RequestWithUser) {
		const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
			request.user,
		);

		return { accessTokenCookie };
	}

	@Post('log-out')
	@HttpCode(200)
	async logOut(@Req() request: RequestWithUser) {
		await this.authService.removeRefreshToken(request.user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@UseGuards(RolesGuard)
	@Post('signup')
	signUp(
		@Body() signupInputs: SignupInputs,
		@GetUser() user: User,
	): Promise<User> {
		if (
			!hasRole(Role.TEACHER, signupInputs.roles) &&
			!hasRole(Role.ADMIN, signupInputs.roles)
		) {
			return this.authService.signUp(signupInputs, user);
		} else {
			throw new BadRequestException('Something bad happened', {
				cause: new Error(),
				description: "You can't create teacher or admin from here.",
			});
		}
	}

	@HasRoles(Role.MAIN_ADMIN)
	@UseGuards(RolesGuard)
	@Post('signup/admin')
	signUpAdmin(
		@Body() signupInputs: SignupInputs,
		@GetUser() user: User,
	): Promise<User> {
		if (hasRole(Role.ADMIN, signupInputs.roles)) {
			return this.authService.signUp(signupInputs, user);
		} else {
			throw new BadRequestException('Something bad happened', {
				cause: new Error(),
				description: 'You can create only admin from here.',
			});
		}
	}

	@Post('signup/teacher')
	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	signUpTeacher(
		@Body() signupInputs: SignupInputs,
		@GetUser() user: User,
	): Promise<User> {
		if (hasRole(Role.TEACHER, signupInputs.roles)) {
			return this.authService.signUp(signupInputs, user);
		} else {
			throw new BadRequestException('Something bad happened', {
				cause: new Error(),
				description: 'You can create only teacher from here.',
			});
		}
	}

	@Put('update-password')
	updatePassword(
		@Body() updatePasswordDto: UpdatePasswordDto,
		@GetUser() user: User,
	): Promise<User> {
		return this.authService.updatePassword(updatePasswordDto, user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@Put('reset-password')
	resetPassword(
		@Body() resetPasswordInputs: ResetPasswordInputs,
		@GetUser() user: User,
	): Promise<User> {
		return this.authService.resetPassword(resetPasswordInputs, user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@UseGuards(RolesGuard)
	@Patch('change-status')
	changeUserStatus(
		@Body() changeUserStatusDto: ChangeUserStatusDto,
		@GetUser() user: User,
	): Promise<User> {
		return this.authService.changeUserStatus(changeUserStatusDto, user);
	}
}
