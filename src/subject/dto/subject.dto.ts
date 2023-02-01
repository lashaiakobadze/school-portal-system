import {
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator';

export class SubjectDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsString()
	@IsNotEmpty()
	level: string;
}