import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../models/token-payload.interface';
import { User } from '../user.schema';
import { UserRepository } from '../user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    const { id } = payload;

    const user: User = await this.userRepository.getUserById(id);
    console.log('JwtStrategy user', user);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
