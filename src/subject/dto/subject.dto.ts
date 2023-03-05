import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class SubjectDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	@IsString()
	creatorId: string;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsEnum(Status)
	status: Status;
}