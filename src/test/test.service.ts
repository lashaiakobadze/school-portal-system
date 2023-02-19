import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.schema';
import { assignTestToSubjectDto } from './dto/assignTestToSubject.dto';
import { TestDto } from './dto/test.dto';
import { TestRepository } from './test.repository';
import { Test } from './test.schema';

@Injectable()
export class TestService {
	constructor(private testRepository: TestRepository) {}

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
		let test: Test = await this.get(inputs.testId);
		test.subject = inputs.subjectId;

		return this.testRepository.onUpdate(test._id.toString(), test);
	}
}
