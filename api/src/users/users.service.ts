import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    // Initialisation optionnelle pour créer un admin si la base est vide
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

    async findOne(email: string): Promise<any | undefined> {
        console.log(`[UsersService] Searching MongoDB for user: ${email}`);
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
            console.error('[UsersService] Error finding user in MongoDB:', error);
        }
        return undefined;
    }
}
