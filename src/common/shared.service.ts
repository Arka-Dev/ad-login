import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityDocument, EntityLogs } from './schema/entitylogs';

@Injectable()
export class SharedService {
	constructor(
		@InjectModel(EntityLogs.name) private entityModel: Model<EntityDocument>,
	) {}

	find(entityName: string) {
		const entityLogs = this.entityModel
			.find({ entity_name: entityName })
			.exec();
		return entityLogs;
	}
}
