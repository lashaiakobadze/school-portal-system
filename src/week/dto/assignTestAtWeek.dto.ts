import { IsNotEmpty } from 'class-validator';
import { Test } from 'src/test/test.schema';

export class assignTestAtWeekDto {
	@IsNotEmpty()
	weekId: string;

	@IsNotEmpty()
	testId: Test;
}
