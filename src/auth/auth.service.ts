import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
    ){}

    async register({name, email, password}: RegisterDto){  //registerDto

        const user = await this.usersService.findOneByEmail(email);

        if (user) {
            throw new BadRequestException('User already exist');
        }

         return await this.usersService.create({
            name,
            email,
            password: await bcryptjs.hash(password, 10)
    });
    }

    async login({email, password}: LoginDto){
        const user = await this.usersService.findOneByEmail(email);
        if(!user){
            throw new UnauthorizedException('email is wrong');
        }
        
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('password is wrong');
        }

        return user;
    }

}