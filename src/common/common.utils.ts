import { Injectable } from '@nestjs/common';
import { Channel } from './constant';

@Injectable()
export class CommonUtils {
	public getRandomOtp(): number {
		const startingRange = 100000,
			endingRange = 900000;
		return process.env.NODE_ENV !== 'production'
			? parseInt(process.env.DEFAULT_OTP)
			: Math.floor(startingRange + Math.random() * endingRange);
	}
	public addHours(date: Date, hours: number) {
		const hourSeconds = 3600,
			nanoSeconds = 1000;
		const newDate = new Date(
			date.getTime() + hours * hourSeconds * nanoSeconds,
		);
		return newDate;
	}

	public iterateChangeDateTime = obj => {
		const addHoursForIST = 5.5;
		Object.keys(obj).forEach(key => {
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				if (obj[key] instanceof Date) {
					obj[key] = this.addHours(obj[key], addHoursForIST);
				} else {
					obj[key] = this.iterateChangeDateTime(obj[key]);
				}
			} else {
				obj[key] = obj[key];
			}
		});
		return obj;
	};

	async getChannels(): Promise<readonly string[]> {
		const channels: Array<string> = [];
		for (const key in Channel) {
			channels.push(Channel[key]);
		}
		return channels;
	}
}
