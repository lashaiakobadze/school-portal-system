import { DataSource, Repository } from 'typeorm';
import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';

import { Profile } from './profile.entity';
import { ProfileDto } from './dto/profile.dto';
import { User } from 'src/auth/user.entity';
import { Role } from 'src/auth/models/role.enum';

@Injectable()
export class ProfileRepository extends Repository<Profile> {
	constructor(private dataSource: DataSource) {
		super(Profile, dataSource.createEntityManager());
	}

	async createProfile(profileDto: ProfileDto): Promise<Profile> {
		const profile: Profile = this.create({
			...profileDto,
		});

		try {
			await this.save(profile);

			return profile;
		} catch (error) {
			// ToDo: improve Error handling
			if (error.code === 11000) {
				throw new ConflictException('Profile already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async updateProfile(profileId: string, profile: Profile): Promise<Profile> {
		const updatedProfile: Profile = {
			...profile,
		};

		try {
			// ToDo: fix this update behavior all key exception.
			await this.update(profileId, updatedProfile);

			return updatedProfile;
		} catch (error) {
			if (error.code === 11000) {
				console.log('error', error);
				throw new ConflictException('Profile already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async getProfileById(profileId: string): Promise<Profile> {
		try {
			const profile = await this.findOneBy({ id: profileId });

			if (profile) {
				return profile;
			}

			throw new HttpException(
				'Profile with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}

	async getProfileByUserId(profileUserId: string): Promise<Profile> {
		try {
			const profile = await this.findOneBy({ user: profileUserId });

			if (profile) {
				return profile;
			}

			throw new HttpException(
				'Profile with this user id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}

	async getProfiles(user: User): Promise<Profile[]> {
		try {
			let profiles: Profile[] = await this.find();

			if (profiles.length) {
				if (user.roles.some(role => role === Role.MAIN_ADMIN)) {
					return profiles;
				} else if (user.roles.some(role => role === Role.ADMIN)) {
					return profiles.filter((profile: Profile) => {
						return profile.roles.some(
							role => role !== Role.MAIN_ADMIN && role !== Role.ADMIN,
						);
					});
				} else if (user.roles.some(role => role === Role.TEACHER)) {
					return profiles.filter((profile: Profile) => {
						return profile.roles.some(
							 role =>
								role !== Role.MAIN_ADMIN &&
								role !== Role.ADMIN &&
								role !== Role.TEACHER,
						);
					});
				}
			}

			throw new HttpException('Profiles does not exist', HttpStatus.NOT_FOUND);
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}
}
