import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api'); // Add prefix for cleaner API calls
    app.enableCors(); // Enable CORS for frontend communication
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`[Main] Application is running on: http://localhost:${port}/api`);
}
bootstrap();
