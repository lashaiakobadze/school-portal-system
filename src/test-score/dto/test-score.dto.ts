import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TestScoreDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	score: number;

	// @IsNotEmpty()
	// @IsString()
	// profile: string;
}
