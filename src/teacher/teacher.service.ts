import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.schema';
import { TeacherDto } from './dto/teacher.dto';
import { TeacherRepository } from './teacher.repository';
import { Teacher } from './teacher.schema';

@Injectable()
export class TeacherService {
	constructor(private teacherRepository: TeacherRepository) {}

	async create(
		inputs: TeacherDto,
		teacherUserId: string,
		user: User,
	): Promise<Teacher> {
		const dto: TeacherDto = {
			user: teacherUserId,
			creatorId: user._id.toString(),
			...inputs,
		};

		return this.teacherRepository.onCreate(dto);
	}

	get(id: string): Promise<Teacher> {
		return this.teacherRepository.getById(id);
	}

	getAll(user: User): Promise<Teacher[]> {
		return this.teacherRepository.getAll(user);
	}

	async update(user: User, inputs: TeacherDto, id: string): Promise<Teacher> {
		let updated: TeacherDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.teacherRepository.onUpdate(id, updated);
	}
}
