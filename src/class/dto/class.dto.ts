import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { Role } from 'src/auth/models/role.enum';

export class ClassDto {
  @IsUUID()
  @IsOptional()
  id?: string;
  
  @IsUUID()
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsString()
  @IsNotEmpty()
  currentStage: string;

  @IsNotEmpty()
  @IsNumber()
  class: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsNotEmpty()
  stages: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsNotEmpty()
  subjects: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(Role, { each: true })
	teachers: Role.TEACHER[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(Role, { each: true })
	students: Role.STUDENT[];
}
