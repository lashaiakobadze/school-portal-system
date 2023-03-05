import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class StageDto {
	@IsOptional()
	id?: string;
	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	stage: number;

	@IsNotEmpty()
	@IsEnum(Status)
	status: Status;

	@IsString()
	@IsOptional()
	class: string;
}
