import { IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Role } from '../models/role.enum';
import { UserStatus } from './user-status.enum';

export class SignupInputs {
	@IsString()
	@Length(8, 20)
	username: string;

	@IsString()
	@Length(8, 20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password is weak',
	})
	password: string;

	@IsString()
	@Length(8, 20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password do not match, password confirm is required.',
	})
	passwordConfirm: string;

	@IsNotEmpty()
	@IsEnum(Role, { each: true })
	roles: Role[];

	@IsNotEmpty()
	@IsEnum(UserStatus)
	status: UserStatus;
}
