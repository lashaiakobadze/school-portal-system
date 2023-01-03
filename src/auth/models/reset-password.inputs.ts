import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordInputs {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is weak',
  })
  newPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password do not match, password confirm is required.',
  })
  passwordConfirm: string;
}
