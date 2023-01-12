import { DataSource, Repository } from 'typeorm';
import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable, InternalServerErrorException,
} from '@nestjs/common';

import { Stage } from './stage.entity';
import { StageDto } from './dto/stage.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class StageRepository extends Repository<Stage> {
	constructor(private dataSource: DataSource) {
		super(Stage, dataSource.createEntityManager());
	}

	async onCreate(dto: StageDto): Promise<Stage> {
		const newCreated: Stage = this.create({
			...dto,
		});

		try {
			await this.save(newCreated);

			return newCreated;
		} catch (error) {
			// ToDo: improve Error handling
			if (error.code === 11000) {
				throw new ConflictException('Stage already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async onUpdate(updated: Stage): Promise<Stage> {
		try {
			await this.update(updated._id, updated);

			return updated;
		} catch (error) {
			if (error.code === 11000) {
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
			const object: Stage = await this.findOneBy({ id });

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
		console.log('user', user);

		try {
			let objects: Stage[] = await this.find();

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
