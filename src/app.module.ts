import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GlobalFilterModule, LoggerModule } from '@mjsl/nestjs-common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/transform.interceptor';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { MjActiveDirectory } from './common/libraries/active-directory/mj-active-directory.library';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './controllers/auth/auth.service';
import { ValidatorService } from './common/validator/validator.service';
import { ValidatorServiceImpl } from './common/validator/implementations/validator.service.impl';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GlobalFilterModule,
    LoggerModule,
    I18nModule.forRoot({
			fallbackLanguage: 'en',
			loaderOptions: {
				path: path.join(__dirname, '/langs/'),
				watch: true,
				includeSubfolders: true,
			},
			resolvers: [HeaderResolver],
		}),
    MongooseModule.forRoot(process.env.MONGODB_URL),
  ],
  controllers: [AuthController],
  providers: [AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    MjActiveDirectory,
    AuthService,
    { provide: ValidatorService, useClass: ValidatorServiceImpl },
  ],
})
export class AppModule {}
