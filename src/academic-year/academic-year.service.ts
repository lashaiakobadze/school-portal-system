import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.schema';
import { AcademicYearRepository } from './academic-year.repository';
import { AcademicYear } from './academic-year.schema';
import { AcademicYearDto } from './dto/academic-year.dto';

@Injectable()
export class AcademicYearService {
	constructor(private academicYearRepository: AcademicYearRepository) {}

	create(inputs: AcademicYearDto, user: User): Promise<AcademicYear> {
		const dto: AcademicYearDto = {
			creatorId: user._id.toString(),
			...inputs,
		};

		return this.academicYearRepository.onCreate(dto);
	}

	get(id: string): Promise<AcademicYear> {
		return this.academicYearRepository.getById(id);
	}

	getAll(user: User): Promise<AcademicYear[]> {
		return this.academicYearRepository.getAll(user);
	}

	async update(
		user: User,
		inputs: AcademicYearDto,
		id: string,
	): Promise<AcademicYear> {
		let updated: AcademicYearDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.academicYearRepository.onUpdate(id, updated);
	}
}
