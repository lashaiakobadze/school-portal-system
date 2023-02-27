import {
	IsDefined,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
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
}
