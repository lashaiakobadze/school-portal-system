import {
	IsEnum,
	IsNotEmpty,
	IsString,
	IsMongoId,
	Length,
	Matches,
} from 'class-validator';
import { Role } from '../models/role.enum';
export class SignupDto {
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
		message: 'password is weak',
	})
	passwordConfirm: string;

	@IsMongoId()
	creatorId: string;

	@IsNotEmpty()
	@IsEnum(Role, { each: true })
	roles: Role[];
}
