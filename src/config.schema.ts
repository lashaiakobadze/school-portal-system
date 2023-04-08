import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
	PORT: Joi.number().default(3000),
	AUTH_CONFIG: Joi.string().required(),
	STAGE: Joi.string().required(),

	JWT_SECRET: Joi.string().required(),
	JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
	JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
	JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
	JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

	REDIS_HOST: Joi.string().required(),
	REDIS_PORT: Joi.number().required(),
	REDIS_PASSWORD: Joi.string().required(),
	SESSION_SECRET: Joi.string().required(),

	AWS_REGION: Joi.string().required(),
	AWS_ACCESS_KEY_ID: Joi.string().required(),
	AWS_SECRET_ACCESS_KEY: Joi.string().required(),
	AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),

	DB_USERNAME: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_URL: Joi.string().required(),
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().required(),
	DB_DATABASE: Joi.string().required(),
	DB_AUTH_SOURCE: Joi.string().required(),
	DB_AUTH_MECHANISM: Joi.string().required(),

	GRAYLOG_HOST: Joi.string().required(),
	GRAYLOG_PORT: Joi.number().required(),
	GRAYLOG_FACILITY: Joi.string().required(),

	SUBSCRIBERS_SERVICE_HOST: Joi.string().required(),
	SUBSCRIBERS_SERVICE_PORT: Joi.number().required(),

	RABBITMQ_USER: Joi.string().required(),
	RABBITMQ_PASSWORD: Joi.string().required(),
	RABBITMQ_HOST: Joi.string().required(),
	RABBITMQ_QUEUE_NAME: Joi.string().required(),
});
