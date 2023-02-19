import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Profile } from 'src/profile/profile.schema';
import { Test } from 'src/test/test.schema';

export class TestScoreDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	score: number;

	@IsNotEmpty()
	@IsString()
	test: Test

	@IsNotEmpty()
	@IsString()
	profile: Profile;
}
