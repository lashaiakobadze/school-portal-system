import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
	PORT: Joi.number().default(3000),
	STAGE: Joi.string().required(),
	// DB_URL: Joi.string().required(),
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().default(5432).required(),
	// DB_USERNAME: Joi.string().required(),
	// DB_PASSWORD: Joi.string().required(),
	DB_DATABASE: Joi.string().required(),
	JWT_SECRET: Joi.string().required(),

	JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
	JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
	JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
	JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
	SESSION_SECRET: Joi.string(),
	REDIS_HOST: Joi.string().required(),
	REDIS_PORT: Joi.number().required(),
});
