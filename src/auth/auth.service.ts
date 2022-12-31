import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as argon from 'argon2';

import { AuthCredentialDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';
import { SignupInputs } from './models/signup.inputs';
import { SignupDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './models/token-payload.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordInputs } from './models/reset-password.inputs';
import { Role } from './models/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UserRepository,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signUp(signupInputs: SignupInputs, user: User): Promise<void> {
    const { creatorId } = user;

    const signupDto: SignupDto = {
      id: uuid(),
      creatorId,
      ...signupInputs,
    };

    return this.usersRepository.createUser(signupDto);
  }

  async hashPassword(password: string) {
    return await argon.hash(password);
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    currentUser: User,
  ) {
    // 1) Get user from collection
    const user: User = await this.getUserById(currentUser.id);

    // 2) Check if POSTed current password is correct
    if (updatePasswordDto.currentPassword !== user.password) {
      throw new UnauthorizedException('Your current password is wrong.');
    }

    // 3) If so, update password
    user.password = await this.hashPassword(updatePasswordDto.newPassword);
    user.passwordConfirm = await this.hashPassword(
      updatePasswordDto.passwordConfirm,
    );

    return this.usersRepository.updateUser(user._id, user);
  }

  async resetPassword(
    resetPasswordInputs: ResetPasswordInputs,
    currentUser: User,
  ) {
    // 1) Get user from collection
    const user: User = await this.getUserById(resetPasswordInputs.userId);

    // 2) Check if user exist.
    if (!user) {
      throw new UnauthorizedException("This user doesn't exist.");
    }

    // 3) reset password from main admin
    if (currentUser.roles.some(() => user.roles?.includes(Role.MAIN_ADMIN))) {
      user.password = await this.hashPassword(resetPasswordInputs.newPassword);
      user.passwordConfirm = await this.hashPassword(
        resetPasswordInputs.passwordConfirm,
      );
      user.currentHashedRefreshToken = null;

      return this.usersRepository.updateUser(user._id, user);
    }

    // 3) reset password from admin
    else if (
      currentUser.roles.some(() => user.roles?.includes(Role.ADMIN)) &&
      !user.roles.some(() => user.roles?.includes(Role.MAIN_ADMIN)) &&
      !user.roles.some(() => user.roles?.includes(Role.ADMIN))
    ) {
      user.password = await this.hashPassword(resetPasswordInputs.newPassword);
      user.passwordConfirm = await this.hashPassword(
        resetPasswordInputs.passwordConfirm,
      );
      user.currentHashedRefreshToken = null;

      return this.usersRepository.updateUser(user._id, user);
    }

    // 3) reset password from teacher to students and parents
    if (
      currentUser.roles.some(() => user.roles?.includes(Role.TEACHER)) &&
      !user.roles.some(() => user.roles?.includes(Role.ADMIN)) &&
      !user.roles.some(() => user.roles?.includes(Role.MAIN_ADMIN)) &&
      !user.roles.some(() => user.roles?.includes(Role.TEACHER))
    ) {
      user.password = await this.hashPassword(resetPasswordInputs.newPassword);
      user.passwordConfirm = await this.hashPassword(
        resetPasswordInputs.passwordConfirm,
      );
      user.currentHashedRefreshToken = null;

      return this.usersRepository.updateUser(user._id, user);
    }
  }

  /// use when we want only access token.
  // async signIn(
  //   authCredentialDto: AuthCredentialDto,
  // ): Promise<{ accessToken: string }> {
  //   const { username, password } = authCredentialDto;

  //   const user: User = await this.usersRepository.findOneBy({ username });

  //   if (user && (await argon.verify(user.password, password))) {
  //     const roles = user.roles;
  //     const payload = { username, roles };
  //     const accessToken = await this.jwtService.sign(payload);

  //     return { accessToken };
  //   } else {
  //     throw new UnauthorizedException('Please check your login credentials');
  //   }
  // }

  async checkUser(authCredentialDto: AuthCredentialDto): Promise<User | void> {
    const { username, password } = authCredentialDto;

    const user: User = await this.usersRepository.findOneBy({ username });

    if (user && (await argon.verify(user.password, password))) {
      return user;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  public getCookieWithJwtAccessToken(user: User) {
    const payload: TokenPayload = {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    /// FOR COOKIE:
    // return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
    //   'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    // )}`;
    return token;
  }

  public getCookieWithJwtRefreshToken(user: User) {
    const payload: TokenPayload = {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    /// FOR COOKIE:
    // const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
    //   'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    // )}`;

    // return {
    //   cookie,
    //   token,
    // };
    return token;
  }

  async setCurrentRefreshToken(refreshToken: string, user: User) {
    const currentHashedRefreshToken = await argon.hash(refreshToken);
    user.currentHashedRefreshToken = currentHashedRefreshToken;
    this.usersRepository.updateUser(user._id, user);
  }

  async getUserById(userId: string) {
    const user = await this.usersRepository.getUserById(userId);

    return user;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);

    if (!user || user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Please check your credentials');
    }

    const isRefreshTokenMatching = await argon.verify(
      user.currentHashedRefreshToken,
      refreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  /// FOR COOKIE:
  // public getCookiesForLogOut() {
  //   return [
  //     'Authentication=; HttpOnly; Path=/; Max-Age=0',
  //     'Refresh=; HttpOnly; Path=/; Max-Age=0',
  //   ];
  // }

  async removeRefreshToken(user: User) {
    user.currentHashedRefreshToken = null;
    return this.usersRepository.updateUser(user._id, user);
  }
}
