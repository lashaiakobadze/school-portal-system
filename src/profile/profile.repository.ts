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

@Injectable()
export class ProfileRepository extends Repository<Profile> {
  constructor(private dataSource: DataSource) {
    super(Profile, dataSource.createEntityManager());
  }

  async createProfile(profileDto: ProfileDto): Promise<Profile> {
    const profile: Profile = this.create({
      ...profileDto
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
    try {
      await this.update(profileId, profile);

      return profile;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException();
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
}
