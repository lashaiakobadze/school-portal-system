import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.schema';
import { assignSubjectToClassDto } from './dto/assignSubjectToClass.dto';
import { SubjectDto } from './dto/subject.dto';
import { SubjectRepository } from './subject.repository';
import { Subject } from './subject.schema';

@Injectable()
export class SubjectService {
	constructor(private subjectRepository: SubjectRepository) {}

	async create(
		inputs: SubjectDto,
		user: User,
	): Promise<Subject> {
		const dto: SubjectDto = {
			creatorId: user._id.toString(),
			...inputs,
		};

		return this.subjectRepository.onCreate(dto);
	}

	get(id: string): Promise<Subject> {
		return this.subjectRepository.getById(id);
	}

	getAll(user: User): Promise<Subject[]> {
		return this.subjectRepository.getAll(user);
	}

	async update(user: User, inputs: SubjectDto, id: string): Promise<Subject> {
		let updated: SubjectDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.subjectRepository.onUpdate(id, updated);
	}

	async assignToClass(user: User, inputs: assignSubjectToClassDto) {
		let subject: Subject = await this.get(inputs.subjectId);
		subject.classes.push(inputs.classId);

		return this.subjectRepository.onUpdate(subject._id.toString(), subject);
	}
}
