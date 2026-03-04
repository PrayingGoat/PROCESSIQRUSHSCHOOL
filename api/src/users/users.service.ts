import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { hashPassword } from '../auth/password.util';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async onModuleInit() {
        const count = await this.userModel.countDocuments();
        if (count === 0) {
            console.log('[UsersService] Seed: Creating default admin user...');
            await this.userModel.create({
                email: 'admin@rush-school.fr',
                password: 'admin', // En production, hacher ce mot de passe !
                name: 'Admin Rush School',
                role: 'admin'
            });
        }
    }

    async findOne(email: string): Promise<User | undefined> {
        console.log(`[UsersService] Searching MongoDB for user: ${email}`);
        return this.userModel.findOne({ email }).exec();
    }

    async create(userData: any): Promise<any> {
        console.log(`[UsersService] Creating new MongoDB user: ${userData.email}`);
        try {
            const user = await this.userModel.findOne({ email }).exec();
            if (user) {
                return {
                    userId: user._id,
                    email: user.email,
                    password: user.password,
                    name: user.name,
                    role: user.role
                };
            }
        } catch (error) {
            console.error('[UsersService] Error creating user in MongoDB:', error);
            throw error;
        }
    }

    async createStudentAccount(payload: {
        email: string;
        password: string;
        name: string;
        studentId: string;
    }): Promise<any> {
        const existing = await this.userModel.findOne({ email: payload.email }).exec();
        if (existing) {
            throw new Error('Un utilisateur avec cet email existe deja');
        }

        const created = await this.userModel.create({
            email: payload.email,
            password: hashPassword(payload.password),
            name: payload.name,
            role: 'student',
            studentId: payload.studentId
        });

        return {
            userId: created._id,
            email: created.email,
            name: created.name,
            role: created.role,
            studentId: created.studentId
        };
    }
}
