import {
	IsNotEmpty,
} from 'class-validator';
import { Class } from 'src/class/class.schema';

export class assignSubjectToClassDto {
    @IsNotEmpty()
	classId: Class;

    @IsNotEmpty()
	subjectId: string;
}