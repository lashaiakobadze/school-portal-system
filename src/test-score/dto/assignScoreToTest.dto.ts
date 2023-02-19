import { IsNotEmpty } from 'class-validator';
import { Test } from 'src/test/test.schema';

export class assignScoreToTestDto {
	@IsNotEmpty()
	testId: Test;

	@IsNotEmpty()
	testScoreId: string;
}
