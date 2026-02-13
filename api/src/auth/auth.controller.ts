import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('register-student')
    async registerStudent(@Request() req) {
        const { email, password, name, studentId } = req.body || {};
        if (!email || !password || !name || !studentId) {
            return {
                success: false,
                message: 'email, password, name et studentId sont requis'
            };
        }

        try {
            const data = await this.authService.registerStudentAccount({
                email,
                password,
                name,
                studentId
            });
            return { success: true, data };
        } catch (error: any) {
            return { success: false, message: error.message || 'Erreur creation compte' };
        }
    }
}
