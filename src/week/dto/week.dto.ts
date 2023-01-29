import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class WeekDto {
	@IsOptional()
	id?: string;

	@IsNotEmpty()
	creatorId: string;

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
