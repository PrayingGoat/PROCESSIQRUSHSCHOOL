import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { verifyPassword } from './password.util';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && verifyPassword(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { 
            username: user.email, 
            sub: user.userId,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
            role: user.role,
            email: user.email,
            name: user.name
        };
    }

    async register(userData: any) {
        const user = await this.usersService.create(userData);
        return this.login(user);
    }

    async registerStudentAccount(payload: any) {
        const user = await this.usersService.createStudentAccount(payload);
        return this.login(user);
    }
}
