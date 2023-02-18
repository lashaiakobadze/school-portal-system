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
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.schema';
import { TestDto } from './dto/test.dto';
import { Test } from './test.schema';
import { TestService } from './test.service';

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
}
