import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdatePasswordDto {
	@IsString()
	@IsOptional()
	@Length(8, 20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password is weak',
	})
	currentPassword?: string;

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
