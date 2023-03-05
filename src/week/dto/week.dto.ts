import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { Stage } from 'src/stage/stage.schema';
import { Status } from 'src/utils/status.enum';

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
