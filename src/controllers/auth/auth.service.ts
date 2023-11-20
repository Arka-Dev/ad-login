import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MjActiveDirectory } from '../../common/libraries/active-directory/mj-active-directory.library';
import { LoginDto } from '../../dto/auth/login.dto';
import { Domains } from '../../common/constant';

@Injectable()
export class AuthService {

    constructor(
        private mjActiveDirectory: MjActiveDirectory
    ){}

    async checkLogin(params:LoginDto) {
        let response: any;
        switch(params.domain){
            case Domains.MJUNCTION:
            case Domains.METALJUNCTION:{
                await this.mjActiveDirectory.connect();
                response = await this.mjActiveDirectory.authorize(params.username, params.password);
                break;
            }
            default:{
                throw new HttpException({ reason: 'Provided domain is not registered yet.'}, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        const returnResponse: any = {...params};
        delete returnResponse.password;
        returnResponse.authorization = response?.status;
        return {
            response_code: response?.status === true ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
            message: response?.status === true ? "Login Successful" : response?.message,
            data: returnResponse
         };
    }
}
