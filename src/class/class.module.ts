import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcademicYear, AcademicYearSchema } from 'src/academic-year/academic-year.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ClassController } from './class.controller';
import { ClassRepository } from './class.repository';
import { Class, ClassSchema } from './class.schema';
import { ClassService } from './class.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Class.name, schema: ClassSchema },
			{ name: AcademicYear.name, schema: AcademicYearSchema },
		]),
		AuthModule,
	],
	providers: [ClassRepository, ClassService],
	controllers: [ClassController],
	exports: [ClassService, ClassRepository],
})
export class ClassModule {}
