import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length
} from 'class-validator';
import { Role } from 'src/auth/models/role.enum';

export class ProfileDto {
  @IsUUID()
  @IsOptional()
  id?: string;
  
  @IsUUID()
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
  @IsNotEmpty()
  personalNumber: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  profileImg: string;

  @IsOptional()
  @IsEnum(Role, { each: true })
  roles?: Role[];
}
