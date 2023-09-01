import { Body, Controller, Post , Get, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
//import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';
//import { Roles } from './decorators/roles.decorator';
//import { RolesGuard } from './guard/roles.guard';
import { Role } from '../common/enums/role.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

interface RequestWithUser extends Request {
    user: {
        email: string;
        role: string;
    }
}

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('register')
    register(
        @Body()
        registerDto: RegisterDto,
    ){
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(
        @Body()
        loginDto: LoginDto,
    ){
        return this.authService.login(loginDto);
    }

    /* @Get('profile')
    @Roles(Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    profile(
        @Req() req: RequestWithUser,
    ){
        //return req.user;
        return this.authService.profile(req.user)
    } */

    @Get('profile')
    @Auth(Role.USER)  // @Roles y @UseGuards juntos
    profile(@ActiveUser() user: UserActiveInterface){
        console.log(user);
        
        return this.authService.profile(user)
    }

    
}
