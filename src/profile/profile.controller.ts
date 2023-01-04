import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { User } from 'src/auth/user.entity';
import { ProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

	@UseGuards(JwtAuthGuard)
	@Post('registration')
	signUp(
		@Body() profileInputs: ProfileDto,
		@GetUser() user: User,
	): Promise<any> {
        return this.profileService.registrationProfile(profileInputs, user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('get-profile')
	getProfile(
		@GetUser() user: User,
	): Promise<any> {
        return this.profileService.getProfile(user);
	}
}
