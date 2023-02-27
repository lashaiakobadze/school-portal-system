import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length
} from 'class-validator';
import { User } from 'src/auth/user.schema';

export class ProfileDto {
  @IsOptional()
  user?: User;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Length(11)
  // @IsNumber()
  @IsNotEmpty()
  personalNumber: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;
}
