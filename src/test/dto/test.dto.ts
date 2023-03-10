import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class TestDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	orderId: number;

	@IsNotEmpty()
	@IsEnum(Status)
	status: Status;
}
