import {
	IsNotEmpty,
} from 'class-validator';
import { Class } from 'src/class/class.schema';

export class assignStudentToClassDto {
    @IsNotEmpty()
	classId: Class;

    @IsNotEmpty()
	studentId: string;
}