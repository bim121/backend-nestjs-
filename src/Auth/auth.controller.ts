import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { CreateUserDto } from "src/dto/user/user-create-dto";
import { LoginUserDto } from "src/dto/user/user-login-dto";
import { AuthService, LoginStatus, RegistrationStatus } from "./auth.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: 
        AuthService) { }

        @ApiOperation({summary: 'Регистрация користувача'})
        @ApiResponse({status: 200})
        @Post('/register')  
        public async register(@Body() createUserDto: CreateUserDto ): Promise<RegistrationStatus> {    
            const result: RegistrationStatus = await this.authService.register(createUserDto);
            if (!result.success) {
                throw new HttpException(result.message, HttpStatus.BAD_REQUEST);    
            }
            return result;  
        }

        @ApiOperation({summary: 'Авторизація користувача'})
        @ApiResponse({status: 200})
        @Post('/login')  
        public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
            return await this.authService.login(loginUserDto);  
        }

        @Get(':id')
        async getOne(@Param('id') id: number){
            return this.authService.getOne(id);
        }
    
}