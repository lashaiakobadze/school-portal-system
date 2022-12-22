import { DataSource, Repository } from 'typeorm';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(signupDto: SignupDto): Promise<void> {
    const { password } = signupDto;

    // hash
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = this.create({
      ...signupDto,
      password: hashedPassword
    });

    try {
      await this.save(user);
    } catch (error) {
      // ToDo: Error handling
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        console.log('error', error);
        throw new InternalServerErrorException();
      }
    }
  }
}
