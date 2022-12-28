import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JWTModule } from './jwt/JWT.module';
import { RolesGuard } from './roles.guard';
import { LocalStrategy } from './jwt/local.strategy';
import { JwtRefreshTokenStrategy } from './jwt/jwt-refresh.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JWTModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, UserRepository, JwtStrategy, RolesGuard, LocalStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
  exports: [ PassportModule, JwtStrategy ],
})
export class AuthModule {}
