import {
	IsNotEmpty,
} from 'class-validator';
import { Class } from 'src/class/class.schema';

export class assignTeacherToClassDto {
    @IsNotEmpty()
	classId: Class;

    @IsNotEmpty()
	teacherId: string;
}