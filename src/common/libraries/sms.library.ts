import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class SmsLibrary {
	public abstract init(params: any): void;
	public abstract prepareMessage(templates: any, params?: any): any;
	public abstract sendGeneralSMS(params: any): Promise<any>;
}
