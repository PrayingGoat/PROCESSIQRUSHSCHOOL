import 'reflect-metadata';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './src/app.module';

// Disable Vercel's default body parser
export const config = {
    api: {
        bodyParser: false,
    },
};

let cachedApp: any;

export default async function handler(req: any, res: any) {
    console.log(`[Vercel API] Incoming: ${req.method} ${req.url}`);
    console.log(`[Vercel API] __dirname: ${__dirname}`);

    try {
        if (!cachedApp) {
            console.log('[Vercel API] Booting NestJS from ./src/app.module...');
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
            console.log('[Vercel API] NestJS Booted successfully.');
        }

        return cachedApp(req, res);
    } catch (error: any) {
        console.error('[Vercel API] FATAL ERROR:', error);
        return res.status(500).json({
            error: 'NestJS Boot Failure',
            message: error.message,
            stack: error.stack,
            src_path: './src/app.module'
        });
    }
}
