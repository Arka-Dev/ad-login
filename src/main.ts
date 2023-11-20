import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as compression from 'compression';
import { AllExceptionFilter } from './common/all-exception.filter';

const DEFAULT_PORT = 3000;

async function bootstrap() {
  const corsConfig = {
		origin: '*',
		optionsSuccessStatus: 200,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Accept', 'x-api-key', 'authorization'],
		credentials: true,
	};
	const app = await NestFactory.create(AppModule, { cors: corsConfig });
	const WINDOWMS_START_TIME = 5;
	const WINDOWNMS_END_TIME = 60;
	const WINDOWN_TOTAL_TIME = 1000;
	app.use(
		rateLimit({
			windowMs: WINDOWMS_START_TIME * WINDOWNMS_END_TIME * WINDOWN_TOTAL_TIME,
			max: 2000,
		}),
		helmet(),
		compression(),
	);
	app.enableCors();
	app.use(helmet.noSniff());
	app.use(helmet.hidePoweredBy());
	app.use(helmet.contentSecurityPolicy());

	app.useGlobalFilters(new AllExceptionFilter());

	await app.listen(process.env.PORT || DEFAULT_PORT);

	console.log(
		'Active Directory Login Module API HAS BEEN STARTED PORT ON ' +
			(process.env.PORT || DEFAULT_PORT),
	);
}
bootstrap();
