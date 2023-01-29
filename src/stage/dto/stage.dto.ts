import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator';

export class StageDto {
	@IsOptional()
	id?: string;

	@IsNotEmpty()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	stage: number;

	@IsString()
	@IsNotEmpty()
	currentWeekId: string;

	@IsNotEmpty()
	week: string;
}
