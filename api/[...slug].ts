import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../backend/src/app.module';

let cachedApp: any;

export default async function handler(req: any, res: any) {
    console.log(`[Vercel API] Incoming: ${req.method} ${req.url}`);

    try {
        if (!cachedApp) {
            console.log('[Vercel API] Booting NestJS...');
            const app = await NestFactory.create(AppModule);

            app.setGlobalPrefix('api');
            app.enableCors();
            app.useGlobalPipes(new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }));

            await app.init();

            cachedApp = app.getHttpAdapter().getInstance();
            console.log('[Vercel API] NestJS Booted.');
        }

        return cachedApp(req, res);
    } catch (error: any) {
        console.error('[Vercel API] CRASH:', error);
        return res.status(500).json({
            error: 'NestJS Boot Failure',
            message: error.message,
            stack: error.stack,
            env: {
                has_airtable: !!process.env.AIRTABLE_API_KEY
            }
        });
    }
}
