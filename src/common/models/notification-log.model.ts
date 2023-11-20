import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationLogs } from '../schema/notificationlogs';

@Injectable()
export class NotificationLogModel {
	constructor(
		@InjectModel(NotificationLogs.name)
		private notificationlogModel: Model<NotificationLogs>,
	) {}

	public async saveLog(param: any) {
		const createdNotificationLog = new this.notificationlogModel(param);
		createdNotificationLog.save();
		return createdNotificationLog;
	}
}
