import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class ChangeStatusDto {
	@IsNotEmpty()
	@IsString()
	id: string;

	@IsNotEmpty()
	@IsEnum(Status)
	status: Status;
}
