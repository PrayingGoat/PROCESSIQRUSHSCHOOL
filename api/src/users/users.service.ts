import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    // Liste d'utilisateurs en dur pour le moment
    private readonly users = [
        {
            userId: 1,
            email: 'admin@rush-school.fr',
            password: 'admin', // À changer plus tard par un hash
            name: 'Admin Rush School'
        },
        {
            userId: 2,
            email: 'demo@rush-school.fr',
            password: 'demo',
            name: 'Utilisateur Démo'
        }
    ];

    async findOne(email: string): Promise<any | undefined> {
        console.log(`[UsersService] Looking for user: ${email}`);
        
        // Recherche dans la liste locale
        const user = this.users.find(u => u.email === email);
        
        if (user) {
            console.log(`[UsersService] User found: ${user.name}`);
            return user;
        }

        console.warn(`[UsersService] User NOT found: ${email}`);
        return undefined;
    }
}
