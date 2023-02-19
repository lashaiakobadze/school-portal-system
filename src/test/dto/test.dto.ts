import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TestDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsNumber()
	orderId: number;
}
