import { IsNotEmpty, IsString, IsMongoId, Length, Matches } from 'class-validator';
import { ObjectId } from 'mongoose';

export class ResetPasswordInputs {
	@IsNotEmpty()
	@IsString()
	@IsMongoId()
	userId: ObjectId;

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
