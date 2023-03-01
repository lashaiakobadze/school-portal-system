import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from './status.enum';

export class ChangeStatusDto {
	@IsNotEmpty()
	@IsString()
	id: string;

	@IsNotEmpty()
	@IsEnum(Status)
	status: Status;
}
