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
import { assignTeacherToClassDto } from './dto/assignTeacherToClass.dto';
import { TeacherDto } from './dto/teacher.dto';
import { Teacher } from './teacher.schema';
import { TeacherService } from './teacher.service';
import ParamsWithId from 'src/shared/DTOs/paramsWithId';

@UseInterceptors(MongooseClassSerializerInterceptor(Teacher))
@Controller('teacher')
export class TeacherController {
    constructor(private teacherService: TeacherService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create/:id')
	create(@Body() inputs: TeacherDto, @Param('id') teacherUserId: string, @GetUser() user: User): Promise<Teacher> {
		return this.teacherService.create(inputs, teacherUserId, user);
	}
	
	@Get('get/:id')
	get(@Param() { id }: ParamsWithId): Promise<Teacher> {
		return this.teacherService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Teacher[]> {
		return this.teacherService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('update/:id')
	update(
		@Param() { id }: ParamsWithId,
		@Body() inputs: TeacherDto,
		@GetUser() user: User,
	): Promise<Teacher> {
		return this.teacherService.update(user, inputs, id);
	}

	
	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('assign-teacher-to-class')
	assignTeacherToClass(
		@Body() inputs: assignTeacherToClassDto,
		@GetUser() user: User,
	): Promise<Teacher> {
		return this.teacherService.assignTeacherToClass(user, inputs);
	}
}
