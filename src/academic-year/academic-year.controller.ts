import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.schema';
import { AcademicYear } from './academic-year.schema';
import { AcademicYearService } from './academic-year.service';
import { AcademicYearDto } from './dto/academic-year.dto';

@Controller('academic-year')
export class AcademicYearController {
	constructor(private academicYearService: AcademicYearService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create')
	create(
		@Body() inputs: AcademicYearDto,
		@GetUser() user: User,
	): Promise<AcademicYear> {
		return this.academicYearService.create(inputs, user);
	}

	@Get('get/:id')
	get(@Param('id') id: string): Promise<AcademicYear> {
		return this.academicYearService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<AcademicYear[]> {
		return this.academicYearService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('update/:id')
	update(
		@Param('id') id: string,
		@Body() inputs: AcademicYearDto,
		@GetUser() user: User,
	): Promise<AcademicYear> {
		return this.academicYearService.update(user, inputs, id);
	}
}
