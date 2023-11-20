import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { ValidatorService } from "../../common/validator/validator.service";
import { Domains } from "../../common/constant";

@Injectable()
export class LoginPipe implements PipeTransform {
    constructor(
        private validatorService: ValidatorService
    ) {}
    
    async transform(value: any, metadata: ArgumentMetadata) {
        if(metadata.type === 'body'){
            if(this.validatorService.isEmpty(value.username)){
                throw new HttpException({ reason: 'Please provide the username.'}, HttpStatus.BAD_REQUEST);
            }
            if(this.validatorService.isEmpty(value.domain) && !this.validatorService.isEmail(value.username)){
                throw new HttpException({ reason: 'Please provide the domain or provide the full email address.'}, HttpStatus.BAD_REQUEST);
            }
            if(this.validatorService.isEmpty(value.password)){
                throw new HttpException({ reason: 'Please provide the password.'}, HttpStatus.BAD_REQUEST);
            }
            if(this.validatorService.isEmpty(value.domain)){
                value.domain = this.validatorService.extractDomainFromEmail(value.username);
            }
            if(!this.validatorService.isIn(value.domain, Object.values(Domains))){
                throw new HttpException({ reason: 'Provided domain is not registered with us, kindly contact the administrator.'}, HttpStatus.BAD_REQUEST);
            }
        }
        return value;
    }
}