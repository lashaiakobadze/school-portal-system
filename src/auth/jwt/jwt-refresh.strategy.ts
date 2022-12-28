import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenPayload } from '../models/token-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: TokenPayload) {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

      console.log('refreshToken', refreshToken);

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
  /// FOR COOKIE:
  // constructor(
  //   private readonly configService: ConfigService,
  //   private readonly authService: AuthService,
  // ) {
  //   super({
  //     jwtFromRequest: ExtractJwt.fromExtractors([
  //       (request: Request) => {
  //         return request?.cookies?.Refresh;
  //       },
  //     ]),
  //     secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
  //     passReqToCallback: true,
  //   });
  // }

  // async validate(request: Request, payload: TokenPayload) {
  //   const refreshToken = request.cookies?.Refresh;
  //   return this.authService.getUserIfRefreshTokenMatches(
  //     refreshToken,
  //     payload.id,
  //   );
  // }
}
