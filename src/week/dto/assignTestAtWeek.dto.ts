import { IsNotEmpty } from 'class-validator';

export class assignTestAtWeekDto {
	@IsNotEmpty()
	weekId: string;

	@IsNotEmpty()
	testId: string;
}
