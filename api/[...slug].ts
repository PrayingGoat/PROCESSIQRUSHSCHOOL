import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/src/app.module';
import { ValidationPipe } from '@nestjs/common';

export const config = {
    api: {
        bodyParser: false,
    },
};

let cachedApp: any;

export default async function handler(req: any, res: any) {
    try {
        console.log(`[Vercel API] Incoming request: ${req.method} ${req.url}`);

        if (!cachedApp) {
            console.log('[Vercel API] Initializing NestJS app...');
            const app = await NestFactory.create(AppModule);
            app.setGlobalPrefix('api');
            app.enableCors();
            app.useGlobalPipes(new ValidationPipe());
            await app.init();
            cachedApp = app.getHttpAdapter().getInstance();
            console.log('[Vercel API] NestJS app initialized.');
        }

        return cachedApp(req, res);
    } catch (e: any) {
        console.error('[Vercel API] Crash:', e);
        res.status(500).json({ error: e.message, stack: e.stack });
    }
}
