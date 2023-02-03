import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';

import { Stage, StageDocument } from './stage.schema';
import { StageDto } from './dto/stage.dto';
import { User } from 'src/auth/user.schema';
import MongoError from 'src/utils/mongoError.enum';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StageRepository {
	constructor(
		@InjectModel(Stage.name) private stageModel: Model<StageDocument>,
	) {}

	async onCreate(dto: StageDto): Promise<Stage> {
		try {
			const newCreated = await new this.stageModel(dto).save();

			return newCreated;
		} catch (error) {
			// ToDo: improve Error handling
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('Stage already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async onUpdate(id: string, updated: StageDto): Promise<Stage> {
		try {
			await this.stageModel.findByIdAndUpdate(id, updated).exec();

			return updated as any; // Todo: fix all this any case, around of project.
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				console.log('error', error);
				throw new ConflictException('Stage already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async getById(id: string): Promise<Stage> {
		try {
			const object: Stage = await this.stageModel.findById(id).exec();

			if (object) {
				return object;
			}

			throw new HttpException(
				'Stage with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}

	async getAll(user: User): Promise<Stage[]> {
		try {
			let objects: Stage[] = await this.stageModel.find().populate('weeks');

			if (!objects)
				throw new HttpException('Stages does not exist', HttpStatus.NOT_FOUND);

			return objects;
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}
}
