import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.schema';
import { TestScoreDto } from './dto/test-score.dto';
import { TestScoreRepository } from './test-score.repository';
import { TestScore } from './test-score.schema';

@Injectable()
export class TestScoreService {
	constructor(private testScoreRepository: TestScoreRepository) {}

	async create(inputs: TestScoreDto, user: User): Promise<TestScore> {
		const dto: TestScoreDto = {
			creatorId: user._id.toString(),
			...inputs,
		};

		return this.testScoreRepository.onCreate(dto);
	}

	get(id: string): Promise<TestScore> {
		return this.testScoreRepository.getById(id);
	}

	getAll(user: User): Promise<TestScore[]> {
		return this.testScoreRepository.getAll(user);
	}

	async update(
		user: User,
		inputs: TestScoreDto,
		id: string,
	): Promise<TestScore> {
		let updated: TestScoreDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.testScoreRepository.onUpdate(id, updated);
	}
}
