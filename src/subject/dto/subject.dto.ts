import {
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator';

export class SubjectDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	@IsString()
	creatorId: string;

	@IsNotEmpty()
	@IsString()
	name: string;
}