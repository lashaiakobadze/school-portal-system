import { DataSource, Repository } from 'typeorm';
import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable, InternalServerErrorException,
} from '@nestjs/common';

import { Week } from './week.entity';
import { WeekDto } from './dto/week.dto';
import { User } from 'src/auth/user.schema';

@Injectable()
export class WeekRepository extends Repository<Week> {
	constructor(private dataSource: DataSource) {
		super(Week, dataSource.createEntityManager());
	}

	
	async onCreate(dto: WeekDto): Promise<Week> {
		const newCreated: Week = this.create({
			...dto,
		});

		try {
			await this.save(newCreated);

			return newCreated;
		} catch (error) {
			// ToDo: improve Error handling
			if (error.code === 11000) {
				throw new ConflictException('Week already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async onUpdate(updated: Week): Promise<Week> {
		try {
			await this.update(updated._id, updated);

			return updated;
		} catch (error) {
			if (error.code === 11000) {
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
			const object: Week = await this.findOneBy({ id });

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
		console.log('user', user);

		try {
			let objects: Week[] = await this.find();

			if (!objects)
				throw new HttpException('Classes does not exist', HttpStatus.NOT_FOUND);

			return objects;
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}
}
