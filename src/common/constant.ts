export enum GenericStatus {
	Active = 'Y',
	InActive = 'N',
}

export enum GenericDeletedStatus {
	Deleted = 'Y',
	NotDeleted = 'N',
}

export const jwtConstants = {
	secret: '79O7v9K9aeFcz9rRll1062dI2uvHPyrr',
};

export enum Channel {
	SMS = 'sms',
	EMAIL = 'email',
	IN_APP_NOTIFICATION = 'inAppNotifications',
	IOS_NOTIFICATION = 'iosNotifications',
	ANDROID_NOTIFICATION = 'androidNotifications',
	WHATSAPP = 'whatsapp',
}

export enum ChannelMedium {
	Mobile = 'mobileNo',
	Email = 'email',
	AppId = 'applicationId',
	WhatsApp = 'whatsappNumber',
}

export enum Domains {
	MJUNCTION = 'mjunction.in',
	METALJUNCTION = 'metaljunction.com'
}
