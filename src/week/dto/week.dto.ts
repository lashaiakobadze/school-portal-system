import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';
import { Stage } from 'src/stage/stage.schema';

export class WeekDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	weekOrder: number;

	@IsNotEmpty()
	@IsEnum(Status)
	status: Status;

	@IsString()
	@IsOptional()
	stage: Stage;
}
