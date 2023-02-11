import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../user.schema';
import { UsersService } from './user.service';
 
@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly usersService: UsersService,
  ) {
    super();
  }
 
  serializeUser(user: User, done: CallableFunction) {
    done(null, user._id);
  }
 
  async deserializeUser(userId: string, done: CallableFunction) {
    const user = await this.usersService.getById(userId)
    done(null, user);
  }
}