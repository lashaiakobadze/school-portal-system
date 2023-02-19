import { IsNotEmpty } from 'class-validator';
import { Subject } from 'src/subject/subject.schema';

export class assignTestToSubjectDto {
	@IsNotEmpty()
	subjectId: Subject;

	@IsNotEmpty()
	testId: string;
}
