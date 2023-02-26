import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AcademicYearController } from './academic-year.controller';
import { AcademicYearRepository } from './academic-year.repository';
import { AcademicYear, AcademicYearSchema } from './academic-year.schema';
import { AcademicYearService } from './academic-year.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: AcademicYear.name, schema: AcademicYearSchema },
		]),
		AuthModule,
	],
	controllers: [AcademicYearController],
	providers: [AcademicYearService, AcademicYearRepository],
})
export class AcademicYearModule {}
