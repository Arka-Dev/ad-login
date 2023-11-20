import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18nContext } from 'nestjs-i18n';

export interface Response<T> {
	errorMessage: string;
	apiResponse: string;
	data: T;
	error: boolean;
}

@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, Response<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		const i18n = I18nContext.current();
		return next.handle().pipe(
			map(data => {
				const response_code = data.response_code ?? HttpStatus.BAD_REQUEST;
				const msg_code = data.msg_code ?? 'http_response.API_GENERIC_400';
				const msg_params = data.messageParams ?? {};
				const message = data.message ?? i18n.t(msg_code, msg_params);
				const flag = [
					HttpStatus.ACCEPTED,
					HttpStatus.OK,
					HttpStatus.CREATED,
				].includes(response_code)
					? '1'
					: '0';
				let dataActual = data.data ?? data;
				dataActual = JSON.parse(
					JSON.stringify(
						dataActual,
						(key, value) =>
							typeof value === 'bigint' ? value.toString() : value, // return everything else unchanged
					),
				);
				return {
					errorMessage: flag === '1' ? '' : message,
					apiResponse: flag === '0' ? '' : message,
					data: dataActual,
					error: flag === '1' ? false : true,
				};
			}),
		);
	}
}
