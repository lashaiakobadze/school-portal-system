import {
	IsDefined,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

export class ClassDto {
	@IsUUID()
	@IsOptional()
	id?: string;

	@IsUUID()
	@IsOptional()
	creatorId?: string;

	@IsNotEmpty()
	@IsNumber()
	class: number;

	@IsString()
	@IsNotEmpty()
	academicYear: string;

	@IsUUID()
	@IsOptional()
	currentStageId?: string;

	@IsUUID(undefined, { each: true })
	@IsDefined()
	stages: string[];

	@IsUUID(undefined, { each: true })
	@IsDefined()
	subjects: string[];

	@IsUUID(undefined, { each: true })
	@IsDefined()
	teachers: string;

	@IsUUID(undefined, { each: true })
	@IsNotEmpty()
	students: string;
}
