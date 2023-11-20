import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Channel } from '../../constant';
import { KnockHttpLibrary } from '../../knock-http.library';
import { NotificationLogModel } from '../../models/notification-log.model';
import { SendKarixSMSDto } from './dto/send-karix-sms.dto';

@Injectable()
export class KarixLibrary {
	private $url;
	private $apiKey;
	private $version = '1.0';
	private $apiSenderId = '';
	private $entityId = '';

	public constructor(
		private readonly knockHttpLibrary: KnockHttpLibrary,
		private readonly notificationlogModel: NotificationLogModel,
	) {}

	public init(params: any) {
		try {
			if (!params.api_endpoint) {
				throw new HttpException('URL is missing', HttpStatus.BAD_REQUEST);
			}
			if (!params.api_key) {
				throw new HttpException('API Key is missing', HttpStatus.BAD_REQUEST);
			}
			if (!params.api_sender_id) {
				throw new HttpException(
					'API SenderId is missing',
					HttpStatus.BAD_REQUEST,
				);
			}
			this.$url = params.api_endpoint;
			this.$apiKey = params.api_key;
			this.$apiSenderId = params.api_sender_id;
			this.$entityId = params.entity_id;
			if (params.version) {
				this.$version = params.version;
			}
		} catch (error) {
			throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public prepareMessage(template: any, params?: any) {
		let templateMessage: string = template.template_body;
		if (params.params) {
			const { otp } = params.params;
			templateMessage = templateMessage.replace('{0}', otp);
		}
		const mobile = params.phone;
		return {
			dest: [mobile],
			text: templateMessage,
			send: this.$apiSenderId,
			type: 'PM',
			dlt_entity_id: this.$entityId,
			dlt_template_id: template.template_ext_id,
		};
	}

	public async sendGeneralSMS(params: SendKarixSMSDto) {
		const tmNow = new Date();
		const logParams = {
			created_at: tmNow,
			request_body: {},
			response_body: {},
		};
		// const messageParams = {
		// 	ver: this.$version,
		// 	key: this.$apiKey,
		// 	messages: params.messages,
		// };
		const messageParams = {
			ver: this.$version,
			key: this.$apiKey,
			dest: params.messages[0].dest[0],
			text: params.messages[0].text,
			send: params.messages[0].send,
		};
		logParams.request_body['body'] = messageParams;
		logParams['send_to'] = params.messages[0].dest[0];
		logParams['type'] = Channel.SMS;
		const headers = { 'Content-Type': 'application/json' };
		logParams.request_body['headers'] = headers;
		// const response = await this.knockHttpLibrary.post(
		// 	this.$url,
		// 	messageParams,
		// 	{ headers },
		// );
		const response = await this.knockHttpLibrary.get(this.$url, messageParams);
		logParams.response_body = response;
		const log = await this.notificationlogModel.saveLog(logParams);
		return { response, log };
	}
}
