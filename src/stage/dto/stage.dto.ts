import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator';

export class StageDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	stage: number;

	@IsString()
	@IsNotEmpty()
	currentWeekId: string;

	@IsString()
	@IsOptional()
	class: string;

	// @IsNotEmpty()
	// week: string;
}
