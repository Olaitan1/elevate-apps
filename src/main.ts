import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from "dotenv";

async function bootstrap()
{
  dotenv.config(); 
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Financial Application")
    .setDescription("APIs Descriptions")
    .setVersion("1.0")
    .addCookieAuth()
    .addGlobalParameters()
    .addTag(`ELEVATE APPS... Financial Platform`)
    .setTermsOfService(``)
    .addServer(`http://localhost:${3000}`)
    .addServer(`http://localhost:8080`)
    
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
  SwaggerModule.setup("/doc", app, document);
  await app.listen(3000);
}
bootstrap();
