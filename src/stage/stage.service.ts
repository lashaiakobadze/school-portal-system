import { Injectable } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { StageDto } from "./dto/stage.dto";
import { Stage } from "./stage.entity";
import { StageRepository } from "./stage.repository";
import { v4 as uuid } from 'uuid';


@Injectable()
export class StageService {
    constructor(
		private stageRepository: StageRepository
	) {}

	create(inputs: StageDto, user: User): Promise<Stage> {
		const dto: StageDto = {
			id: uuid(),
			creatorId: user.id,
			...inputs,
		};

		return this.stageRepository.onCreate(dto);
	}

	get(id: string): Promise<Stage> {
		return this.stageRepository.getById(id);
	}

	getAll(user: User): Promise<Stage[]> {
		return this.stageRepository.getAll(user);
	}

	async update(user: User, inputs: StageDto, id: string): Promise<Stage> {
		console.log('user', user);

		let classObject: Stage = await this.stageRepository.getById(id);

		let updated: Stage = {
			...classObject,
			...inputs,
			updatedDate: new Date(),
		};

		return this.stageRepository.onUpdate(updated);
	}
}