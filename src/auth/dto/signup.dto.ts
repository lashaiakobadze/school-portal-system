import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";
import { Role } from "../models/role.enum";

export class SignupDto {
  @IsUUID()
  id: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password is weak",
  })
  password: string;

  @IsUUID()
  creatorId: string;

  @IsNotEmpty()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @IsDate()
  createdDate: Date;

  @IsDate()
  @IsOptional()
  updatedDate?: Date;

  @IsDate()
  @IsOptional()
  deletedDate?: Date;
}