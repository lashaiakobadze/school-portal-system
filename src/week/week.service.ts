import { Injectable } from "@nestjs/common";
import { User } from "src/auth/user.schema";
import { WeekDto } from "./dto/week.dto";
import { Week } from "./week.schema";
import { WeekRepository } from "./week.repository";
import { v4 as uuid } from 'uuid';

@Injectable()
export class WeekService {
    constructor(
		private WeekRepository: WeekRepository
	) {}

	create(inputs: WeekDto, user: User): Promise<Week> {
		const dto: WeekDto = {
			id: uuid(),
			creatorId: user._id,
			...inputs,
		};

		return this.WeekRepository.onCreate(dto);
	}

	get(id: string): Promise<Week> {
		return this.WeekRepository.getById(id);
	}

	getAll(user: User): Promise<Week[]> {
		return this.WeekRepository.getAll(user);
	}

	async update(user: User, inputs: WeekDto, id: string): Promise<Week> {
		console.log('user', user);

		let updated: WeekDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.WeekRepository.onUpdate(id, updated);
	}
}