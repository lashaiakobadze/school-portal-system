import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import * as createRedisStore from 'connect-redis';
import { config } from 'aws-sdk';

async function bootstrap() {
	const logger = new Logger();
	const app = await NestFactory.create(AppModule);
	// app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.useGlobalPipes(
		new ValidationPipe({
			forbidUnknownValues: false,
		}),
	);
	app.enableCors();

	/**
	 * server-side-sessions with redis.
	 */
	const configService = app.get(ConfigService);

	const RedisStore = createRedisStore(session);
	const client = createClient({
		legacyMode: true,
		url: `redis://${configService.get('REDIS_HOST')}:${configService.get(
			'REDIS_PORT',
		)}`,
	});

	await client.connect();

	app.use(
		session({
			store: new RedisStore({client} as any),
			secret: configService.get('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false,
		}),
	);

	app.use(passport.initialize());
	app.use(passport.session());

	config.update({
	  accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
	  secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
	  region: configService.get('AWS_REGION'),
	});

	const port = 3000;
	await app.listen(port);
	logger.log(`Application listening on port ${port}`);
}
bootstrap();
