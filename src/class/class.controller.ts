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
import { Class } from './class.schema';
import { ClassService } from './class.service';
import { assignClassToAcademicYearDto } from './dto/assignClassToAcademicYear.dto';
import { ClassDto } from './dto/class.dto';
import ParamsWithId from 'src/shared/DTOs/paramsWithId';

@Controller('class')
@UseInterceptors(MongooseClassSerializerInterceptor(Class))
export class ClassController {
	constructor(private classService: ClassService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create')
	create(@Body() inputs: ClassDto, @GetUser() user: User): Promise<Class> {
		return this.classService.create(inputs, user);
	}

	@Get('get/:id')
	get(@Param() { id }: ParamsWithId): Promise<Class> {
		return this.classService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Class[]> {
		return this.classService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('update/:id')
	update(
		@Param() { id }: ParamsWithId,
		@Body() inputs: ClassDto,
		@GetUser() user: User,
	): Promise<Class> {
		return this.classService.update(user, inputs, id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('assign-to-academic-year')
	assignToSubject(
		@Body() inputs: assignClassToAcademicYearDto,
		@GetUser() user: User,
	): Promise<Class> {
		return this.classService.assignToAcademicYear(user, inputs);
	}
}
