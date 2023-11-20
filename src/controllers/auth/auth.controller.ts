import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../../dto/auth/login.dto';
import { LoginPipe } from '../../pipes/auth/login.pipe';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Post('login')
    @UsePipes(LoginPipe)
    async adLogin(@Body() req: LoginDto){
        return this.authService.checkLogin(req);
    }
}
