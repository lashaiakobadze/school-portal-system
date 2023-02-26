import { IsNotEmpty } from 'class-validator';
import { AcademicYear } from 'src/academic-year/academic-year.schema';

export class assignClassToAcademicYearDto {
	@IsNotEmpty()
	academicYearId: AcademicYear;

	@IsNotEmpty()
	classId: string;
}
