import {
	IsDefined,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
} from 'class-validator';
import { Status } from 'src/utils/status.enum';

export class ClassDto {
	@IsMongoId()
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId?: string;

	@IsNotEmpty()
	@IsNumber()
	class: number;

	@IsNotEmpty()
	@IsEnum(Status)
	status: Status;
}
