import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.schema';
import { Class, ClassDocument } from 'src/class/class.schema';
import { assignSubjectToClassDto } from './dto/assignSubjectToClass.dto';
import { SubjectDto } from './dto/subject.dto';
import { SubjectRepository } from './subject.repository';
import { Subject } from './subject.schema';

@Injectable()
export class SubjectService {
	constructor(
		private subjectRepository: SubjectRepository,
		@InjectModel(Class.name) private classModel: Model<ClassDocument>,
	) {}

	async create(inputs: SubjectDto, user: User): Promise<Subject> {
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
		// Check if the parent object exists
		const parentExists = await this.classModel.exists({ _id: inputs.classId });

		if (parentExists) {
			// Create a new child object and set the foreign key to the parent object's id
			let subject: Subject = await this.get(inputs.subjectId);
			subject.classes.push(inputs.classId);
	
			return this.subjectRepository.onUpdate(subject._id.toString(), subject);
		} else {
			throw new HttpException(`Class with id ${inputs.classId} not found`, HttpStatus.NOT_FOUND);
		}
	}
}
