import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';

export class ResetPasswordInputs {
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	userId: string;

	@IsString()
	@Length(8, 20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password is weak',
	})
	newPassword: string;

	@IsString()
	@Length(8, 20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password do not match, password confirm is required.',
	})
	passwordConfirm: string;
}
