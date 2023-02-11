import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const logger = new Logger();
	const app = await NestFactory.create(AppModule);
	// app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.useGlobalPipes(
		new ValidationPipe({
		  forbidUnknownValues: false
		}),
	  );
	app.enableCors();

	/**
	 * server-side-sessions
	 */
	const configService = app.get(ConfigService);

	app.use(
		session({
			secret: configService.get('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false,
		}),
	);

	app.use(passport.initialize());
	app.use(passport.session());

	const port = 3000;
	await app.listen(port);
	logger.log(`Application listening on port ${port}`);
}
bootstrap();
