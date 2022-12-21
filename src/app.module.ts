import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { UserRepository } from './auth/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        // url: configService.get('DB_URL'),
        useUnifiedTopology: true,
        autoLoadEntities: true,
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        // username: configService.get('DB_USERNAME'),
        // password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        // ssl: true,
        // Only enable this option if your application is in development,
        // otherwise use TypeORM migrations to sync entity schemas:
        // https://typeorm.io/#/migrations
        synchronize: true,
        entities: [],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    UserRepository,
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
