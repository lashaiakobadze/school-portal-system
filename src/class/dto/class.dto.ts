import {
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

	@IsNotEmpty()
	@IsUUID()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	class: number;

	@IsString()
	@IsNotEmpty()
	academicYear: string;

	@IsString()
	@IsNotEmpty()
	currentStageId: string;

	@IsUUID(undefined, { each: true })
	@IsNotEmpty()
	stages: string[];

	@IsUUID(undefined, { each: true })
	@IsNotEmpty()
	subjects: string[];

	@IsUUID(undefined, { each: true })
	@IsNotEmpty()
	teachers: string;

	@IsUUID(undefined, { each: true })
	@IsNotEmpty()
	students: string;
}
