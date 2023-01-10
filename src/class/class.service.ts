import { Injectable } from "@nestjs/common";
import { ClassRepository } from "./class.repository";

@Injectable()
export class ClassService {
    constructor(
		private ClassRepository: ClassRepository
	) {}
}