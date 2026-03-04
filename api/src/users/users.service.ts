import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { hashPassword } from '../auth/password.util';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async onModuleInit() {
<<<<<<< HEAD
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
=======
        console.log('[UsersService] Checking for users in MongoDB...');
>>>>>>> b28a87303c60b11d4a67eb9b85007063f750ee43
        try {
            // Check for Super Admin specifically
            const superAdmin = await this.userModel.findOne({ role: 'super_admin' });
            if (!superAdmin) {
                console.log('[UsersService] No super_admin found. Seeding super_admin...');
                await this.create({
                    email: 'superadmin@rush-school.fr',
                    password: 'superadmin',
                    name: 'Super Administrateur',
                    role: 'super_admin'
                });
            }

            const count = await this.userModel.countDocuments();
            if (count <= 1) { // Only if we only have the super_admin we just created or nothing
                console.log('[UsersService] Seeding default admission admin...');
                
                const admin = await this.userModel.findOne({ role: 'admission' });
                if (!admin) {
                    await this.create({
                        email: 'admin@rush-school.fr',
                        password: 'admin',
                        name: 'Administrateur Admission',
                        role: 'admission'
                    });
                }
                console.log('[UsersService] Default users seeded successfully.');
            } else {
                console.log(`[UsersService] Found ${count} users in database.`);
            }
        } catch (error) {
<<<<<<< HEAD
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
=======
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
>>>>>>> b28a87303c60b11d4a67eb9b85007063f750ee43
    }
}
