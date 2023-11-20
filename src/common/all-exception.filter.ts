import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
	catch(exception: T, host: ArgumentsHost) {
		if (exception instanceof Error) {
		}
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();
		const msg =
			exception instanceof HttpException
				? exception.getResponse()
				: 'Invalid data format';
		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.NOT_ACCEPTABLE;
		if (
			process.env.environment === 'production' ||
			process.env.environment === 'development' ||
			process.env.environment === 'qa'
		) {
			// Any Mail or Configuration want to do
		}
		response.status(status).json({
			path: request.url,
			errorMessage: msg,
			error: true,
			data: request.body,
		});
	}
}
