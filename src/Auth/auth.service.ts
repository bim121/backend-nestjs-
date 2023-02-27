import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from '../entity/user.entity';
import { UserDto } from "src/dto/user/user-dto";
import { toUserDto } from "src/shared/mapper";
import { LoginUserDto } from "src/dto/user/user-login-dto";
import { CreateUserDto } from "src/dto/user/user-create-dto";
import { UserService } from "src/user/user.service";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UserService, private readonly jwtService: JwtService,  ) {
        
    }
    async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
            success: true,   
            message: 'user registered',
        };
        try {
            await this.usersService.create(userDto);
        } catch (err) {
            status = {
                success: false,        
                message: err,
            };    
        }
        return status;  
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {    
        const user = await this.usersService.findByLogin(loginUserDto);
         
        const token = this._createToken(user);
        
        return {
            username: user.username, ...token,    
        };  
    }
    
    private _createToken({ username }: UserDto): any {
        const user: JwtPayload = { username };    
        const accessToken = this.jwtService.sign(user);    
        return {
            expiresIn: '1800s',
            accessToken,    
        };  
    }

    async validateUser(payload: JwtPayload): Promise<UserDto> {
        const user = await this.usersService.findByPayload(payload);    
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);    
        }    
        return user;  
    }
    
}

export interface RegistrationStatus {  
    success: boolean;  
    message: string;
}

export interface LoginStatus {  
    username: string;

}