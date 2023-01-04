import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { ProfileDto } from './dto/profile.dto';
import { ProfileRepository } from './profile.repository';
import { v4 as uuid } from 'uuid';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService {
	constructor(private profileRepository: ProfileRepository) {}

	registrationProfile(profileInputs: ProfileDto, user: User): Promise<Profile> {
		const profileDto: ProfileDto = {
			id: uuid(),
            user: user.id,
			...profileInputs,
		};

		return this.profileRepository.createProfile(profileDto);
	}

	getProfile(user: User): Promise<Profile> {
		return this.profileRepository.getProfileByUserId(user.id);
	}
}

