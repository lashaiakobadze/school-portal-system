import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.schema';
import { Profile, ProfileDocument } from 'src/profile/profile.schema';
import { Test, TestDocument } from 'src/test/test.schema';
import { TestScoreDto } from './dto/test-score.dto';
import { TestScoreRepository } from './test-score.repository';
import { TestScore } from './test-score.schema';

@Injectable()
export class TestScoreService {
	constructor(
		private testScoreRepository: TestScoreRepository,
		@InjectModel(Test.name) private testModel: Model<TestDocument>,
		@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
	) {}

	async create(inputs: TestScoreDto, user: User): Promise<TestScore> {
		// Check if the parent object exists
		const parentTestExists = await this.testModel.exists({
			_id: inputs.test,
		});

		const parentProfileExists = await this.profileModel.exists({
			_id: inputs.profile,
		});

		if (parentTestExists && parentProfileExists) {
			// Create a new child object and set the foreign key to the parent object's id
			const dto: TestScoreDto = {
				creatorId: user._id.toString(),
				...inputs,
			};
	
			return this.testScoreRepository.onCreate(dto);
		} else {
			throw new HttpException(
				`Test or Profile with id ${inputs.test} or ${inputs.profile} not found`,
				HttpStatus.NOT_FOUND,
			);
		}
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
