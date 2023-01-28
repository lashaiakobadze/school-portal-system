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
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.schema';
import { Class } from './class.schema';
import { ClassService } from './class.service';
import { ClassDto } from './dto/class.dto';

@Controller('class')
export class ClassController {
	constructor(private classService: ClassService) {}

    @HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post('create')
	create(@Body() inputs: ClassDto, @GetUser() user: User): Promise<Class> {
		return this.classService.create(inputs, user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('get/:id')
	get(@Param('id') id: string): Promise<Class> {
		return this.classService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Class[]> {
		return this.classService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Put('update/:id')
	update(
		@Param('id') id: string,
		@Body() inputs: ClassDto,
		@GetUser() user: User,
	): Promise<Class> {
		return this.classService.update(user, inputs, id);
	}
}
