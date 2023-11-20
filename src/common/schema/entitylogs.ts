import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EntityDocument = HydratedDocument<EntityLogs>;

@Schema()
export class EntityLogs {
	@Prop()
	entity_name: string;

	@Prop()
	entity_number: number;

	@Prop()
	month: number;

	@Prop()
	year: number;

	@Prop()
	created_at: Date;

	@Prop()
	entity_reference_number: string;
}

export const EntityLogsSchema = SchemaFactory.createForClass(EntityLogs);
