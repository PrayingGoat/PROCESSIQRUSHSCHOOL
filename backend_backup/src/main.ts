import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api'); // Add prefix for cleaner API calls
    app.enableCors(); // Enable CORS for frontend communication
    await app.listen(3001);
}
bootstrap();
