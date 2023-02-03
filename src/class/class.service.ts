import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.schema';
import { ClassRepository } from './class.repository';
import { ClassDto } from './dto/class.dto';
import { Class } from './class.schema';

@Injectable()
export class ClassService {
	constructor(private classRepository: ClassRepository) {}

	create(inputs: ClassDto, user: User): Promise<Class> {
		const dto: ClassDto = {
			creatorId: user._id.toString(),
			...inputs,
		};

		return this.classRepository.onCreate(dto);
	}

	get(id: string): Promise<Class> {
		return this.classRepository.getById(id);
	}

	getAll(user: User): Promise<Class[]> {
		return this.classRepository.getAll(user);
	}

	async update(user: User, inputs: ClassDto, id: string): Promise<Class> {
		let updated: ClassDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.classRepository.onUpdate(id, updated);
	}
}
