import {
	ForbiddenException,
	Injectable,
	NotAcceptableException,
	UnauthorizedException,
} from '@nestjs/common';

import * as argon from 'argon2';

import { AuthCredentialDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.schema';
import { SignupInputs } from './models/signup.inputs';
import { SignupDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './models/token-payload.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordInputs } from './models/reset-password.inputs';
import { Role } from './models/role.enum';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { ObjectId } from 'mongoose';
import { hasRole } from '../shared/decorators/has-role.decorator';
import { GraylogService } from 'nestjs-graylog';

@Injectable()
export class AuthService {
	constructor(
		private usersRepository: UserRepository,
		private jwtService: JwtService,
		private readonly configService: ConfigService,
		private graylogService: GraylogService
	) {}

	signUp(signupInputs: SignupInputs, user: User): Promise<User> {
		const { creatorId } = user;

		const signupDto: SignupDto = {
			creatorId,
			...signupInputs,
		};

		return this.usersRepository.createUser(signupDto);
	}

	async getUserById(userId: ObjectId) {
		const user = await this.usersRepository.getUserById(userId);

		return user;
	}

	async hashPassword(password: string) {
		return await argon.hash(password);
	}

	async checkUser(authCredentialDto: AuthCredentialDto): Promise<User> {
		const { username, password } = authCredentialDto;
		await this.graylogService.debug('test message', { foo: 'bar' });

		const user: User = await this.usersRepository.findByName(username);

		if (user && (await argon.verify(user.password, password))) {
			return user;
		} else {
			throw new UnauthorizedException('Please check your login credentials');
		}
	}

	public getCookieWithJwtAccessToken(user: User) {
		const payload: TokenPayload = {
			id: user._id,
			username: user.username,
			roles: user.roles,
		};

		const token = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
			expiresIn: `${this.configService.get(
				'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
			)}s`,
		});

		return token;
	}

	public getCookieWithJwtRefreshToken(user: User) {
		const payload: TokenPayload = {
			id: user._id,
			username: user.username,
			roles: user.roles,
		};

		const token = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
			expiresIn: `${this.configService.get(
				'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
			)}s`,
		});

		return token;
	}

	async setCurrentRefreshToken(refreshToken: string, user: User) {
		const currentHashedRefreshToken = await argon.hash(refreshToken);
		user.currentHashedRefreshToken = currentHashedRefreshToken;
		this.usersRepository.updateUser(user);
	}

	async getUserIfRefreshTokenMatches(refreshToken: string, userId: ObjectId) {
		const user = await this.usersRepository.getUserById(userId);

		if (!user || !user.currentHashedRefreshToken) {
			throw new UnauthorizedException('Please check your credentials');
		}

		const isRefreshTokenMatching = await argon.verify(
			user.currentHashedRefreshToken,
			refreshToken,
		);

		if (isRefreshTokenMatching) {
			return user;
		}
	}

	async removeRefreshToken(user: User) {
		user.currentHashedRefreshToken = null;
		return this.usersRepository.updateUser(user);
	}

	async updatePassword(
		updatePasswordDto: UpdatePasswordDto,
		currentUser: User,
	) {
		// Get user from collection
		const user: User = await this.usersRepository.getUserById(currentUser._id);

		const isCurrentPasswordCorrect = await argon.verify(
			user.password,
			updatePasswordDto.currentPassword,
		);

		// Check if POSTed current password is correct
		if (!isCurrentPasswordCorrect) {
			throw new UnauthorizedException('Your current password is wrong.');
		}

		if (updatePasswordDto.newPassword !== updatePasswordDto.passwordConfirm) {
			throw new NotAcceptableException('Password do not match.');
		}

		// If so, update password
		user.password = await this.hashPassword(updatePasswordDto.newPassword);
		user.passwordConfirm = await this.hashPassword(
			updatePasswordDto.passwordConfirm,
		);

		return this.usersRepository.updateUser(user);
	}

	async resetPassword(
		resetPasswordInputs: ResetPasswordInputs,
		currentUser: User,
	) {
		// Get user from collection
		const user: User = await this.usersRepository.getUserById(
			resetPasswordInputs.userId,
		);

		// Check if user exist.
		if (!user) {
			throw new UnauthorizedException("This user doesn't exist.");
		}

		// reset password from main admin
		if (hasRole(Role.MAIN_ADMIN, currentUser.roles)) {
			if (
				resetPasswordInputs.newPassword !== resetPasswordInputs.passwordConfirm
			) {
				throw new NotAcceptableException('Password do not match.');
			}

			user.password = await this.hashPassword(resetPasswordInputs.newPassword);
			user.passwordConfirm = await this.hashPassword(
				resetPasswordInputs.passwordConfirm,
			);
			user.currentHashedRefreshToken = null;

			return this.usersRepository.updateUser(user);
		}

		// reset password from admin
		if (
			hasRole(Role.ADMIN, currentUser.roles) &&
			!hasRole(Role.MAIN_ADMIN, user.roles) &&
			!hasRole(Role.ADMIN, user.roles)
		) {
			if (
				resetPasswordInputs.newPassword !== resetPasswordInputs.passwordConfirm
			) {
				throw new NotAcceptableException('Password do not match.');
			}

			user.password = await this.hashPassword(resetPasswordInputs.newPassword);
			user.passwordConfirm = await this.hashPassword(
				resetPasswordInputs.passwordConfirm,
			);
			user.currentHashedRefreshToken = null;

			return this.usersRepository.updateUser(user);
		}

		// reset password from teacher to students and parents
		if (
			hasRole(Role.TEACHER, currentUser.roles) &&
			!hasRole(Role.MAIN_ADMIN, user.roles) &&
			!hasRole(Role.ADMIN, user.roles) &&
			!hasRole(Role.TEACHER, user.roles)
		) {
			if (
				resetPasswordInputs.newPassword !== resetPasswordInputs.passwordConfirm
			) {
				throw new NotAcceptableException('Password do not match.');
			}

			user.password = await this.hashPassword(resetPasswordInputs.newPassword);
			user.passwordConfirm = await this.hashPassword(
				resetPasswordInputs.passwordConfirm,
			);
			user.currentHashedRefreshToken = null;

			return this.usersRepository.updateUser(user);
		}

		throw new ForbiddenException("You can't this action with your status.");
	}

	async changeUserStatus(
		changeUserStatusDto: ChangeUserStatusDto,
		currentUser: User,
	) {
		// Get user from collection
		const user: User = await this.usersRepository.getUserById(
			changeUserStatusDto.userId,
		);

		// Check if user exist.
		if (!user) {
			throw new UnauthorizedException("This user doesn't exist.");
		}

		// change status from main admin
		if (hasRole(Role.MAIN_ADMIN, currentUser.roles)) {
			return this.usersRepository.updateUserStatus(
				user._id.toString(),
				changeUserStatusDto,
			);
		}

		// change status from admin
		else if (
			hasRole(Role.ADMIN, currentUser.roles) &&
			!hasRole(Role.MAIN_ADMIN, user.roles) &&
			!hasRole(Role.ADMIN, user.roles)
		) {
			return this.usersRepository.updateUserStatus(
				user._id.toString(),
				changeUserStatusDto,
			);
		}

		// change status from teacher to students and parents
		if (
			hasRole(Role.TEACHER, currentUser.roles) &&
			!hasRole(Role.MAIN_ADMIN, user.roles) &&
			!hasRole(Role.ADMIN, user.roles) &&
			!hasRole(Role.TEACHER, user.roles)
		) {
			return this.usersRepository.updateUserStatus(
				user._id.toString(),
				changeUserStatusDto,
			);
		}

		throw new ForbiddenException("You can't this action with your status.");
	}
}
