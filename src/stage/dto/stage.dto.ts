import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

export class StageDto {
	@IsUUID()
	@IsOptional()
	id?: string;

	@IsNotEmpty()
	@IsUUID()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	stage: number;

	@IsString()
	@IsNotEmpty()
	currentWeekId: string;

	@IsUUID(undefined, { each: true })
	@IsNotEmpty()
	week: string;
}
