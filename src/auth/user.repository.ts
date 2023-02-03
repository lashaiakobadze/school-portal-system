import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import * as argon from 'argon2';

import { UserDocument, User } from './user.schema';
import { SignupDto } from './dto/signup.dto';

import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId } from 'mongoose';
import MongoError from 'src/utils/mongoError.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  async createUser(signupDto: SignupDto): Promise<User> {
    const { password } = signupDto;

    const hashedPassword = await argon.hash(password);

    const createdUser = new this.userModel({
      ...signupDto,
      password: hashedPassword,
    });

    try {
      await createdUser.save();

      return createdUser;
    } catch (error) {
      // ToDo: improve Error handling
      if (error.code === MongoError.DuplicateKey) {
        throw new ConflictException('Username already exists');
      } else {
        console.log('error', error);
        throw new InternalServerErrorException();
      }
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      await this.userModel.findOneAndUpdate(user._id, user);
      return user;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }

  // ToDo: improve this method for patch actions.
  // async updateUserStatus(user: User): Promise<User> {
  //   try {
  //     // await this.save(user);

  //     return user;
  //   } catch (error) {
  //     console.log('error', error);
  //     throw new InternalServerErrorException();
  //   }
  // }

  async getUserById(id: ObjectId): Promise<User> {
    try {
      const user = await this.userModel.findById(id);

      if (user) {
        return user;
      }

    } catch (error) {
      // ToDo: improve Error handling
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }

  async findByName(name: string): Promise<User> {
      try {
        const user = await this.userModel.findOne({ username: name });
  
        if (user) {
          return user;
        }

      } catch (error) {
        // ToDo: improve Error handling
        console.log('error', error);
        throw new InternalServerErrorException();
      }
    }
}
