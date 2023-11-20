import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class EmailLibrary {
	public abstract addConfiguration(params: any): void;
	public abstract sendGeneralEmail(params: any): Promise<any>;
}
