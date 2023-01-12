import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class WeekDto {
	@IsUUID()
	@IsOptional()
	id?: string;

	@IsNotEmpty()
	@IsUUID()
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
