import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { HasRoles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User } from 'src/auth/user.schema';
import MongooseClassSerializerInterceptor from 'src/shared/interceptors/mongooseClassSerializer.interceptor';
import { TestScoreDto } from './dto/test-score.dto';
import { TestScore } from './test-score.schema';
import { TestScoreService } from './test-score.service';

@UseInterceptors(MongooseClassSerializerInterceptor(TestScore))
@Controller('test-score')
export class TestScoreController {
	constructor(private testScoreService: TestScoreService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create')
	create(
		@Body() inputs: TestScoreDto,
		@GetUser() user: User,
	): Promise<TestScore> {
		return this.testScoreService.create(inputs, user);
	}

	@Get('get/:id')
	get(@Param('id') id: string): Promise<TestScore> {
		return this.testScoreService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<TestScore[]> {
		return this.testScoreService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('update/:id')
	update(
		@Param('id') id: string,
		@Body() inputs: TestScoreDto,
		@GetUser() user: User,
	): Promise<TestScore> {
		return this.testScoreService.update(user, inputs, id);
	}
}
