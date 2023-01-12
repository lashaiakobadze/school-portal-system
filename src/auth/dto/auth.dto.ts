import { IsString, Length, Matches } from 'class-validator';
export class AuthCredentialDto {
	@IsString()
	@Length(8, 20)
	username: string;

	@IsString()
	@Length(8, 32)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password is weak',
	})
	password: string;
}
