import { DataSource, Repository } from 'typeorm';
import {
	Injectable,
} from '@nestjs/common';

import { Week } from './week.entity';

@Injectable()
export class WeekRepository extends Repository<Week> {
	constructor(private dataSource: DataSource) {
		super(Week, dataSource.createEntityManager());
	}
}
