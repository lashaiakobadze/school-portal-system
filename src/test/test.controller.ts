import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Put,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.schema';
import { TestDto } from './dto/test.dto';
import { Test } from './test.schema';
import { TestService } from './test.service';
import { assignTestToSubjectDto } from './dto/assignTestToSubject.dto';
import { ChangeStatusDto } from 'src/utils/change-status.dto';

@UseInterceptors(MongooseClassSerializerInterceptor(Test))
@Controller('test')
export class TestController {
	constructor(private testService: TestService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create')
	create(@Body() inputs: TestDto, @GetUser() user: User): Promise<Test> {
		return this.testService.create(inputs, user);
	}

	@Get('get/:id')
	get(@Param('id') id: string): Promise<Test> {
		return this.testService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Test[]> {
		return this.testService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('update/:id')
	update(
		@Param('id') id: string,
		@Body() inputs: TestDto,
		@GetUser() user: User,
	): Promise<Test> {
		return this.testService.update(user, inputs, id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('assign-to-subject')
	assignToSubject(
		@Body() inputs: assignTestToSubjectDto,
		@GetUser() user: User,
	): Promise<Test> {
		return this.testService.assignToSubject(user, inputs);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@UseGuards(RolesGuard)
	@Patch('change-status')
	changeUserStatus(
		@Body() changeStatusDto: ChangeStatusDto,
		@GetUser() user: User,
	): Promise<Test> {
		return this.testService.changeStatus(changeStatusDto, user);
	}
}
