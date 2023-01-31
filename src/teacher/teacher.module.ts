import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { TeacherController } from './teacher.controller';
import { TeacherRepository } from './teacher.repository';
import { Teacher, TeacherSchema } from './teacher.schema';
import { TeacherService } from './teacher.service';

@Module({
  imports: [
		MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
		AuthModule,
	],
  controllers: [TeacherController],
  providers: [TeacherService, TeacherRepository],
  exports: [TeacherService]
})
export class TeacherModule {}
