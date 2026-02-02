import { Injectable } from '@nestjs/common';
import * as Airtable from 'airtable';

@Injectable()
export class UsersService {
    private base: Airtable.Base;

    constructor() {
        // NOTE: Configure these env vars in Vercel or .env
        // For now we assume they will be present
        if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
            Airtable.configure({
                apiKey: process.env.AIRTABLE_API_KEY,
            });
            this.base = Airtable.base(process.env.AIRTABLE_BASE_ID);
        }
    }

    async findOne(email: string): Promise<any | undefined> {
        if (!this.base) {
            console.warn("Airtable not configured, returning mock user");
            // Mock user for development if no Airtable config
            if (email === 'admin@rush-school.fr') {
                return {
                    userId: 1,
                    email: 'admin@rush-school.fr',
                    password: 'admin', // In real app, verify hash
                    name: 'Admin User'
                };
            }
            return undefined;
        }

        try {
            const records = await this.base('Users').select({
                filterByFormula: `{Email} = '${email}'`,
                maxRecords: 1
            }).firstPage();

            if (records.length > 0) {
                const fields = records[0].fields;
                return {
                    userId: records[0].id,
                    email: fields['Email'],
                    password: fields['Password'], // In real app, store hash
                    name: fields['Name']
                };
            }
        } catch (error) {
            console.error("Airtable lookup failed:", error);
        }

        return undefined;
    }
}
