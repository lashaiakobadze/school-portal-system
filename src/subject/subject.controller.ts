import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.schema';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { assignSubjectToClassDto } from './dto/assignSubjectToClass.dto';
import { SubjectDto } from './dto/subject.dto';
import { Subject } from './subject.schema';
import { SubjectService } from './subject.service';

@UseInterceptors(MongooseClassSerializerInterceptor(Subject))
@Controller('subject')
export class SubjectController {
    constructor(private subjectService: SubjectService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create')
	create(@Body() inputs: SubjectDto, @GetUser() user: User): Promise<Subject> {
		return this.subjectService.create(inputs, user);
	}

	
	@Get('get/:id')
	get(@Param('id') id: string): Promise<Subject> {
		return this.subjectService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Subject[]> {
		return this.subjectService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('update/:id')
	update(
		@Param('id') id: string,
		@Body() inputs: SubjectDto,
		@GetUser() user: User,
	): Promise<Subject> {
		return this.subjectService.update(user, inputs, id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('assign-to-class')
	assignToClass(
		@Body() inputs: assignSubjectToClassDto,
		@GetUser() user: User,
	): Promise<Subject> {
		return this.subjectService.assignToClass(user, inputs);
	}
}
