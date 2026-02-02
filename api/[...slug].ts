import 'reflect-metadata';

let cachedApp: any;

export default async function handler(req: any, res: any) {
    console.log(`[Vercel API] Handler started: ${req.method} ${req.url}`);

    try {
        if (!cachedApp) {
            console.log('[Vercel API] Importing dependencies dynamically...');
            const { NestFactory } = await import('@nestjs/core');
            const { ValidationPipe } = await import('@nestjs/common');
            const { AppModule } = await import('../backend/src/app.module');

            console.log('[Vercel API] Creating NestJS app instance...');
            const app = await NestFactory.create(AppModule);

            console.log('[Vercel API] Configuring NestJS app...');
            app.setGlobalPrefix('api');
            app.enableCors();
            app.useGlobalPipes(new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }));

            console.log('[Vercel API] Initializing NestJS app...');
            await app.init();

            cachedApp = app.getHttpAdapter().getInstance();
            console.log('[Vercel API] NestJS app initialized successfully.');
        }

        return cachedApp(req, res);
    } catch (error: any) {
        console.error('[Vercel API] FATAL ERROR:', error);
        return res.status(500).json({
            error: 'Internal Server Error (Vercel Boot)',
            message: error.message,
            stack: error.stack,
            env: {
                node_env: process.env.NODE_ENV,
                has_airtable: !!process.env.AIRTABLE_API_KEY
            }
        });
    }
}
