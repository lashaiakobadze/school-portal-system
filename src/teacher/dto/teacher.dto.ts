import {
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator';

export class TeacherDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsString()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	lastName: string;

	@IsString()
	@IsOptional()
	user: string;
}