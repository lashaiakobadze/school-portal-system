import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested
} from 'class-validator';

export class WeekDto {
  @IsUUID()
  @IsOptional()
  id?: string;
  
  @IsUUID()
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;
  
  @IsNotEmpty()
  @IsString()
  stage: string;

  @IsNotEmpty()
  @IsNumber()
  testScore: number;

  @IsNotEmpty()
  @IsNumber()
  homeworkScore: number;

  @IsNotEmpty()
  @IsNumber()
  onlineTestScore: number;

  @IsNotEmpty()
  @IsNumber()
  activityScore: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsNotEmpty()
  week: string;
}
