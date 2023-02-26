import {
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
} from 'class-validator';
import { Status } from 'src/utils/status.enum';

export class AcademicYearDto {
	@IsMongoId()
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId?: string;

	@IsNumber()
	@IsNotEmpty()
	academicYearFrom: number;

	@IsNumber()
	@IsNotEmpty()
	academicYearTo: number;

	@IsNotEmpty()
	@IsEnum(Status)
	status: Status;
}
