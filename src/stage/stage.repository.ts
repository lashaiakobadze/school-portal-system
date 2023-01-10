import { DataSource, Repository } from 'typeorm';
import {
	Injectable,
} from '@nestjs/common';

import { Stage } from './stage.entity';

@Injectable()
export class StageRepository extends Repository<Stage> {
	constructor(private dataSource: DataSource) {
		super(Stage, dataSource.createEntityManager());
	}
}
