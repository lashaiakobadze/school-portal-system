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

	@IsNumber()
	@IsNotEmpty()
	currentWeek: number;

	@IsString()
	@IsOptional()
	class: string;
}
