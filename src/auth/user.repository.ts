import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import * as argon from 'argon2';

import { User } from './user.entity';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(signupDto: SignupDto): Promise<User> {
    const { password } = signupDto;

    const hashedPassword = await argon.hash(password);

    const user: User = this.create({
      ...signupDto,
      password: hashedPassword,
    });

    try {
      await this.save(user);

      return user;
    } catch (error) {
      // ToDo: improve Error handling
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      } else {
        console.log('error', error);
        throw new InternalServerErrorException();
      }
    }
  }

  async updateUser(userId: string, user: User): Promise<User> {
    try {
      await this.update(userId, user);
      return user;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }

  async updateUserStatus(user: User): Promise<User> {
    try {
      await this.save(user);

      return user;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }



  async getUserById(userId: string): Promise<User> {
    try {
      const user = await this.findOneBy({ id: userId });

      if (user) {
        return user;
      }

      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      // ToDo: improve Error handling
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }
}
