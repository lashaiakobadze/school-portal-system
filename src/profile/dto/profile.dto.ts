import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

export class ProfileDto {
  @IsOptional()
  user?: string;

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

  @IsOptional()
  profileImg: string;
}
