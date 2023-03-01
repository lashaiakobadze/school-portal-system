import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.schema';
import { Subject, SubjectDocument } from 'src/subject/subject.schema';
import { ChangeStatusDto } from 'src/utils/change-status.dto';
import { assignTestToSubjectDto } from './dto/assignTestToSubject.dto';
import { TestDto } from './dto/test.dto';
import { TestRepository } from './test.repository';
import { Test } from './test.schema';

@Injectable()
export class TestService {
	constructor(
		private testRepository: TestRepository,
		@InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
	) {}

	async create(inputs: TestDto, user: User): Promise<Test> {
		const dto: TestDto = {
			creatorId: user._id.toString(),
			...inputs,
		};

		return this.testRepository.onCreate(dto);
	}

	get(id: string): Promise<Test> {
		return this.testRepository.getById(id);
	}

	getAll(user: User): Promise<Test[]> {
		return this.testRepository.getAll(user);
	}

	async update(user: User, inputs: TestDto, id: string): Promise<Test> {
		let updated: TestDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.testRepository.onUpdate(id, updated);
	}

	async assignToSubject(user: User, inputs: assignTestToSubjectDto) {
		// Check if the parent object exists
		const parentExists = await this.subjectModel.exists({
			_id: inputs.subjectId,
		});

		if (parentExists) {
			// Create a new child object and set the foreign key to the parent object's id
			let test: Test = await this.get(inputs.testId);
			test.subject = inputs.subjectId;

			return this.testRepository.onUpdate(test._id.toString(), test);
		} else {
			throw new HttpException(
				`Subject with id ${inputs.subjectId} not found`,
				HttpStatus.NOT_FOUND,
			);
		}
	}

	async changeStatus(
		changeStatusDto: ChangeStatusDto,
		user: User,
	): Promise<Test> {
		const changeObj: Test = await this.testRepository.getById(
			changeStatusDto.id,
		);

		changeObj.status = changeStatusDto.status;

		return this.testRepository.onUpdate(changeObj._id.toString(), changeObj);
	}
}
