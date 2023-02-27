import {
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator';
import { User } from 'src/auth/user.schema';
import { Class } from 'src/class/class.schema';

export class TeacherDto {
	@IsOptional()
	id?: string;

	@IsOptional()
	creatorId: string;

	@IsNotEmpty()
	@IsString()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	lastName: string;

	@IsString()
	@IsOptional()
	user: User;

	@IsOptional()
	classes: Class[];
}