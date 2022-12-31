import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthCredentialDto } from './dto/auth.dto';
import { User } from './user.entity';

import { HasRoles } from './decorators/roles.decorator';
import { GetUser } from './decorators/get-user.decorator';

import { LocalAuthGuard } from './jwt/local-auth.guard';
import { RolesGuard } from './roles.guard';
import JwtRefreshGuard from './jwt/jwt-refresh.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

import RequestWithUser from './models/requestsWithUser';
import { SignupInputs } from './models/signup.inputs';
import { Role } from './models/role.enum';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordInputs } from './models/reset-password.inputs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie =
      this.authService.getCookieWithJwtAccessToken(user);
    /// FOR COOKIE:
    // const { cookie: refreshTokenCookie, token: refreshToken } =
    //   this.authService.getCookieWithJwtRefreshToken(user);

    const refreshToken = this.authService.getCookieWithJwtRefreshToken(user);

    await this.authService.setCurrentRefreshToken(refreshToken, user);
    /// FOR COOKIE:
    // request.res.setHeader('Set-Cookie', [
    //   accessTokenCookie,
    //   refreshToken,
    // ]);

    return {
      accessTokenCookie,
      refreshToken,
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user,
    );

    /// FOR COOKIE:
    // request.res.setHeader('Set-Cookie', accessTokenCookie);
    // return request.user;
    
    return accessTokenCookie;
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.authService.removeRefreshToken(request.user);

    /// FOR COOKIE:
    // request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  /// use when we want only access token.
  // @Post('/signin')
  // signIn(
  //   @Body() authCredentialDto: AuthCredentialDto,
  // ): Promise<{ accessToken: string }> {
  //   return this.authService.signIn(authCredentialDto);
  // }

  @HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/signup')
  signUp(
    @Body() signupInputs: SignupInputs,
    @GetUser() user: User,
  ): Promise<void> {
    if (
      signupInputs.roles.some(role => role !== Role.TEACHER) &&
      signupInputs.roles.some(role => role !== Role.ADMIN)
    ) {
      return this.authService.signUp(signupInputs, user);
    } else {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: "You can't create teacher or admin from here.",
      });
    }
  }

  @HasRoles(Role.MAIN_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/signup/admin')
  signUpAdmin(
    @Body() signupInputs: SignupInputs,
    @GetUser() user: User,
  ): Promise<void> {
    if (signupInputs.roles.some(role => role === Role.ADMIN)) {
      return this.authService.signUp(signupInputs, user);
    } else {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'You can create only admin from here.',
      });
    }
  }

  @Post('/signup/teacher')
  @HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  signUpTeacher(
    @Body() signupInputs: SignupInputs,
    @GetUser() user: User,
  ): Promise<void> | void {
    if (signupInputs.roles.some(role => role === Role.TEACHER)) {
      return this.authService.signUp(signupInputs, user);
    } else {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'You can create only teacher from here.',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update-password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.authService.updatePassword(updatePasswordDto, user);
  }

  @HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
  @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
  resetPassword(
    @Body() resetPasswordInputs: ResetPasswordInputs,
    @GetUser() user: User,
  ): Promise<void> {
    return this.authService.updatePassword(resetPasswordInputs, user);
  }
}
