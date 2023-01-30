import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class WeekDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	week: number;

	@IsString()
	@IsOptional()
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
}
