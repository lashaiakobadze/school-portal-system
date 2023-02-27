import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Class, ClassSchema } from 'src/class/class.schema';
import { TeacherController } from './teacher.controller';
import { TeacherRepository } from './teacher.repository';
import { Teacher, TeacherSchema } from './teacher.schema';
import { TeacherService } from './teacher.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Teacher.name, schema: TeacherSchema },
			{ name: Class.name, schema: ClassSchema },
		]),
		AuthModule,
	],
	controllers: [TeacherController],
	providers: [TeacherService, TeacherRepository],
	exports: [TeacherService],
})
export class TeacherModule {}
