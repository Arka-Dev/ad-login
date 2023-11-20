import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationLogDocument = HydratedDocument<NotificationLogs>;

@Schema()
export class NotificationLogs {
	@Prop()
	type: string;

	@Prop()
	created_at: Date;

	@Prop({ type: Object, required: true })
	request_body: any;

	@Prop({ type: Object, required: true })
	response_body: any;

	@Prop()
	send_to: string;
}

export const NotificationLogsSchema =
	SchemaFactory.createForClass(NotificationLogs);
