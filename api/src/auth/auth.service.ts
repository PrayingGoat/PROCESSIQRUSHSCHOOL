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
            role: user.role,
            studentId: user.studentId ? String(user.studentId) : null
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async registerStudentAccount(data: {
        email: string;
        password: string;
        name: string;
        studentId: string;
    }) {
        return this.usersService.createStudentAccount(data);
    }
}
