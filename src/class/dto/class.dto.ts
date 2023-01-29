import {
	IsDefined,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export class ClassDto {
	@IsMongoId()
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId?: string;

	@IsNotEmpty()
	@IsNumber()
	class: number;

	@IsString()
	@IsNotEmpty()
	academicYear: string;

	@IsOptional()
	currentStageId?: string;

	@IsDefined()
	stages: string[];

	@IsDefined()
	subjects: string[];

	@IsDefined()
	teachers: string;

	@IsNotEmpty()
	students: string;
}
