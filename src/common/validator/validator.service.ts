import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ValidatorService {
	public abstract isEmpty(value: any): boolean;
	public abstract isArray(value: any): boolean;
	public abstract isEmail(value: string): boolean;
	public abstract minLength(value: unknown, min_length: number): boolean;
	public abstract isIn(value: unknown, array: unknown[]): boolean;
	public abstract isBoolean(value: unknown): boolean;
	public abstract isDate(value: unknown): boolean;
	public abstract isNumber(value: unknown): boolean;
	public abstract min(value: unknown[]): unknown;
	public abstract extractDomainFromEmail(email: string): string;
}
