import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/src/app.module';
import { ValidationPipe } from '@nestjs/common';

let cachedApp: any;

export default async function handler(req: any, res: any) {
    if (!cachedApp) {
        const app = await NestFactory.create(AppModule);
        app.setGlobalPrefix('api');
        app.enableCors();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp(req, res);
}
