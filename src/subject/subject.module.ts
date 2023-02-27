import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject } from 'rxjs';
import { AuthModule } from 'src/auth/auth.module';
import { Class, ClassSchema } from 'src/class/class.schema';
import { SubjectController } from './subject.controller';
import { SubjectRepository } from './subject.repository';
import { SubjectSchema } from './subject.schema';
import { SubjectService } from './subject.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Subject.name, schema: SubjectSchema },
			{ name: Class.name, schema: ClassSchema },
		]),
		AuthModule,
	],
	controllers: [SubjectController],
	providers: [SubjectService, SubjectRepository],
	exports: [SubjectService],
})
export class SubjectModule {}
