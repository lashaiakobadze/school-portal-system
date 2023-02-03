import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable, InternalServerErrorException,
} from '@nestjs/common';

import { Week, WeekDocument } from './week.schema';
import { WeekDto } from './dto/week.dto';
import { User } from 'src/auth/user.schema';
import MongoError from 'src/utils/mongoError.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WeekRepository {
	constructor(
		@InjectModel(Week.name) private weekModel: Model<WeekDocument>,
	) {}
	
	async onCreate(dto: WeekDto): Promise<Week> {
		try {
			const newCreated = await new this.weekModel(dto).save();

			return newCreated;
		} catch (error) {
			// ToDo: improve Error handling
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('Week already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async onUpdate(id: string, updated: WeekDto): Promise<Week> {
		try {
			await this.weekModel.findByIdAndUpdate(id, updated).exec();

			return updated as any;
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				console.log('error', error);
				throw new ConflictException('Week already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async getById(id: string): Promise<Week> {
		try {
			const object: Week = await this.weekModel.findById(id).exec();

			if (object) {
				return object;
			}

			throw new HttpException(
				'Week with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}

	async getAll(user: User): Promise<Week[]> {
		try {
			let objects: Week[] =  await this.weekModel.find();
			if (!objects)
				throw new HttpException('Weeks does not exist', HttpStatus.NOT_FOUND);

			return objects;
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}
}
