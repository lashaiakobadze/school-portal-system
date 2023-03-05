import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.schema';
import MongoError from 'src/shared/enums/mongoError.enum';
import { TestScoreDto } from './dto/test-score.dto';
import { TestScore, TestScoreDocument } from './test-score.schema';

@Injectable()
export class TestScoreRepository {
	constructor(
		@InjectModel(TestScore.name)
		private testScoreModel: Model<TestScoreDocument>,
	) {}

	async onCreate(dto: TestScoreDto): Promise<TestScore> {
		try {
			const newCreated = await new this.testScoreModel(dto).save();

			return newCreated;
		} catch (error) {			
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('TestScore already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async onUpdate(id: string, updated: TestScoreDto): Promise<TestScore> {
		try {
			await this.testScoreModel.findByIdAndUpdate(id, updated).exec();

			return updated as any; // Todo: fix all this any case, around of project.
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				console.log('error', error);
				throw new ConflictException('TestScore already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async getById(id: string): Promise<TestScore> {
		try {
			const object: TestScore = await this.testScoreModel.findById(id);

			if (object) {
				return object;
			}

			throw new HttpException(
				'TestScore with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {			
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}

	async getAll(user: User): Promise<TestScore[]> {
		try {
			let objects: TestScore[] = await this.testScoreModel
				.find()
				.populate('profile')
				.populate('test');

			if (!objects)
				throw new HttpException(
					'TestScore does not exist',
					HttpStatus.NOT_FOUND,
				);

			return objects;
		} catch (error) {			
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}
}
