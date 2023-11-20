import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class KnockHttpLibrary {
	constructor(private readonly httpService: HttpService) {}

	async post(
		url: string,
		params: any,
		options: any = {},
	): Promise<AxiosResponse> {
		return await lastValueFrom(
			this.httpService.post(url, params, options).pipe(map(resp => resp.data)),
		);
	}

	async get(url: string, params: any): Promise<AxiosResponse> {
		const parameter_str = new URLSearchParams(params).toString();
		const full_url = url + '?' + parameter_str;
		Logger.log(full_url, 'FULL URL');
		return await lastValueFrom(
			this.httpService.get(full_url).pipe(map(resp => resp.data)),
		);
	}
}
