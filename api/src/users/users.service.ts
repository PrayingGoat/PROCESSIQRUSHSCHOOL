import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel as InjectMongooseModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { hashPassword } from '../auth/password.util';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(@InjectMongooseModel(User.name) private userModel: Model<User>) { }

    async onModuleInit() {
        console.log('[UsersService] Checking for users in MongoDB...');
        try {
            const defaultUsers = [
                {
                    email: 'superadmin@processiq.fr',
                    password: 'superadmin',
                    name: 'Super Administrateur',
                    role: 'super_admin'
                },
                {
                    email: 'rh@processiq.fr',
                    password: 'rh',
                    name: 'Responsable RH',
                    role: 'rh'
                },
                {
                    email: 'commercial@processiq.fr',
                    password: 'commercial',
                    name: 'Commercial',
                    role: 'commercial'
                },
                {
                    email: 'admission@processiq.fr',
                    password: 'admission',
                    name: 'Administrateur Admission',
                    role: 'admission'
                }
            ];

            for (const userData of defaultUsers) {
                const existing = await this.userModel.findOne({ email: userData.email });
                if (!existing) {
                    console.log(`[UsersService] Seeding default user: ${userData.email}`);
                    await this.create({
                        ...userData,
                        password: hashPassword(userData.password)
                    });
                }
            }
            
            const count = await this.userModel.countDocuments();
            console.log(`[UsersService] Total users in database: ${count}.`);
        } catch (error) {
            console.error('[UsersService] Error during database seeding:', error);
        }
    }

    async findOne(email: string): Promise<User | undefined> {
        console.log(`[UsersService] Searching MongoDB for user: ${email}`);
        return this.userModel.findOne({ email }).exec();
    }

    async create(userData: any): Promise<any> {
        console.log(`[UsersService] Creating new MongoDB user: ${userData.email}`);
        try {
            // Note: If password is not hashed yet, it should be hashed here if needed, 
            // but usually it's handled by the caller or a middleware.
            // In the seed logic above, it's passed as plain text in some versions, but createStudentAccount uses hashPassword.
            const newUser = new this.userModel(userData);
            const savedUser = await newUser.save();
            return {
                userId: savedUser._id,
                email: savedUser.email,
                name: savedUser.name,
                role: savedUser.role
            };
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
