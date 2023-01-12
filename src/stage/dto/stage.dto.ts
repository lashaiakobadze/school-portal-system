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

export class StageDto {
  @IsUUID()
  @IsOptional()
  id?: string;
  
  @IsUUID()
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;
  
  @IsNotEmpty()
  @IsNumber()
  stage: number;

  @IsString()
  @IsNotEmpty()
  currentWeek: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsNotEmpty()
  week: string;
}
