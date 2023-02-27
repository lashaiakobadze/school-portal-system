import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/auth/user.schema";
import { StageDto } from "./dto/stage.dto";
import { Stage } from "./stage.schema";
import { StageRepository } from "./stage.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Class, ClassDocument } from "src/class/class.schema";

@Injectable()
export class StageService {
    constructor(
		private stageRepository: StageRepository,
		@InjectModel(Class.name) private classModel: Model<ClassDocument>,
	) {}

	async create(inputs: StageDto, classId: string, user: User): Promise<Stage> {
				// Check if the parent object exists
				const parentExists = await this.classModel.exists({
					_id: classId,
				});
		
				if (parentExists) {
					const dto: StageDto = {
						class: classId,
						creatorId: user._id.toString(),
						...inputs,
					};
			
					return this.stageRepository.onCreate(dto);
				} else {
					throw new HttpException(
						`Class with id ${classId} not found`,
						HttpStatus.NOT_FOUND,
					);
				}
	}

	get(id: string): Promise<Stage> {
		return this.stageRepository.getById(id);
	}

	getAll(user: User): Promise<Stage[]> {
		return this.stageRepository.getAll(user);
	}

	async update(user: User, inputs: StageDto, id: string): Promise<Stage> {
		let updated: StageDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.stageRepository.onUpdate(id, updated);
	}
}