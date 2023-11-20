import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationLogModel } from '../../models/notification-log.model';
import { Channel } from '../../constant';

@Injectable()
export class MjLibrary {
	protected params: any;

	constructor(
		private mailerService: MailerService,
		private readonly notificationlogModel: NotificationLogModel,
	) {}

	public addConfiguration(params: any): void {
		this.params = Object.assign({}, params);
		const smtpConfig: any = { auth: {} };
		if (params.from) {
			smtpConfig.from = params.from;
		}
		if (params.port) {
			smtpConfig.port = params.port;
		}
		if (params.host) {
			smtpConfig.host = params.host;
		}
		if (params.username) {
			smtpConfig.auth.user = params.username;
		}
		if (params.password) {
			smtpConfig.auth.pass = params.password;
		}
		if (params.auth) {
			smtpConfig.auth.type = 'login';
		}
		smtpConfig.secure = false;
		this.mailerService.addTransporter('smtps', smtpConfig);
	}

	public async sendGeneralEmail(params: any): Promise<any> {
		const tmNow = new Date();
		const logParams = {
			created_at: tmNow,
			request_body: {},
			response_body: {},
		};
		logParams.request_body = params;
		logParams['send_to'] = params.to;
		logParams['type'] = Channel.EMAIL;
		const response = await this.mailerService.sendMail({
			to: params.to, // list of receivers
			cc: params.cc ?? '',
			bcc: params.bcc ?? '',
			from: params.from, // sender address
			subject: params.subject, // Subject line
			html: params.body, // HTML body content
			headers: {
				'X-SES-CONFIGURATION-SET': 'mj-mail-event-stream',
			},
			transporterName: 'smtps',
		});
		logParams.response_body = response;
		const log = await this.notificationlogModel.saveLog(logParams);
		return { response, log };
	}
}
