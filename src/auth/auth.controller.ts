import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from './models/role.enum';
import { RolesGuard } from './roles.guard';
import { SignupInputs } from './models/signup.inputs';
import { HasRoles } from './roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialDto);
  }

  @HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/signup')
  signUp(@Body() signupInputs: SignupInputs): Promise<void> {
    if (signupInputs.roles.some(role => role !== Role.TEACHER) && signupInputs.roles.some(role => role !== Role.ADMIN)) {
      return this.authService.signUp(signupInputs);
    } else {
      throw new BadRequestException('Something bad happened', { cause: new Error(), description: "You can't create teacher or admin from here." });
    }
  }

  @HasRoles(Role.MAIN_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/signup/admin')
  signUpAdmin(@Body() signupInputs: SignupInputs): Promise<void> {
    console.log('signupInputs', signupInputs);
    if (signupInputs.roles.some(role => role === Role.ADMIN)) {
      return this.authService.signUp(signupInputs);
    } else {
      throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'You can create only admin from here.' });
    }
  }

  @HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard, AuthGuard())
  @Post('/signup/teacher')
  signUpTeacher(@Body() signupInputs: SignupInputs): Promise<void> {
    if (signupInputs.roles.some(role => role === Role.TEACHER)) {
      return this.authService.signUp(signupInputs);
    } else {
      throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'You can create only teacher from here.' });
    }
  }
}
