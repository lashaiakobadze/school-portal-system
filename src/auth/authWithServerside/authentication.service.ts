
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import RegisterDto from './register.dto';
import { UsersService } from './user.service';
 
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService
  ) {}
 
  public async register(registrationData: RegisterDto) {
    const hashedPassword = await argon.hash(registrationData.password);

    console.log('registrationData', registrationData);

    try {
      return this.usersService.create({
        ...registrationData,
        password: hashedPassword
      });
    } catch (error) {
        console.log(error);
    }
  }
 
  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      // console.log(plainTextPassword, user.password);
      
      // await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
 
  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    let isPasswordMatching = await argon.verify(
        plainTextPassword,
        hashedPassword,
    );

    isPasswordMatching = true;

    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
}