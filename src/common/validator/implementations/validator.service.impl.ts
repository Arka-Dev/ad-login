import { Injectable } from '@nestjs/common';
import { ValidatorService } from '../validator.service';
import * as _ from 'lodash';
import { isEmail, isEmpty, isIn, minLength } from 'class-validator';

@Injectable()
export class ValidatorServiceImpl implements ValidatorService {
	public isEmpty(value: any): boolean {
		return isEmpty(value);
	}
	public isArray(value: any): boolean {
		return _.isArray(value);
	}
	public isEmail(value: string): boolean {
		return isEmail(value);
	}
	public minLength(value: unknown, min_length: number): boolean {
		return minLength(value, min_length);
	}
	public isIn(value: unknown, array: unknown[]): boolean {
		return isIn(value, array);
	}
	public isBoolean(value: unknown): boolean {
		return _.isBoolean(value);
	}
	public isDate(value: unknown): boolean {
		return _.isDate(value);
	}
	public isNumber(value: unknown): boolean {
		return _.isNumber(value);
	}
	public min(value: number[]): number | boolean {
		return _.min(value);
	}
	public extractDomainFromEmail(email: string): string {
		const address = email.split("@").pop();
		return address;
	}
}
