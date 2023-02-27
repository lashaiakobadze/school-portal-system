import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class WeekDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	weekOrder: number;

	@IsString()
	@IsOptional()
	stage: string;
}
