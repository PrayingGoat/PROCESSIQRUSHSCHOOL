import 'reflect-metadata';

// CRITICAL: Disable Vercel's default body parser so NestJS can handle the stream.
export const config = {
    api: {
        bodyParser: false,
    },
};

let cachedApp: any;

export default async function handler(req: any, res: any) {
    console.log(`[Vercel API] Incoming: ${req.method} ${req.url}`);

    try {
        if (!cachedApp) {
            console.log('[Vercel API] Booting NestJS...');

            // Dynamic imports inside the try-catch to catch bundling/export errors
            const { NestFactory } = await import('@nestjs/core');
            const { ValidationPipe } = await import('@nestjs/common');
            const { AppModule } = await import('../backend/src/app.module');

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
        console.error('[Vercel API] FATAL ERROR IN HANDLER:', error);

        // Ensure we return JSON so the frontend doesn't get a SyntaxError: JSON.parse
        return res.status(500).json({
            error: 'NestJS Initialization Failed',
            message: error.message,
            stack: error.stack,
            hint: 'Check if all dependencies are in the root package.json and AppModule is correctly paths.',
            env: {
                has_airtable: !!process.env.AIRTABLE_API_KEY,
                node_env: process.env.NODE_ENV
            }
        });
    }
}
