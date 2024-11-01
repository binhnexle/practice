import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   const swaggerDocPath = 'docs';
   app.use(
      [`/${swaggerDocPath}`, `/${swaggerDocPath}-json`],
      basicAuth({
         challenge: false,
         users: {
            ['admin']: 'admin',
         },
      }),
   );

   const swaggerConfig = new DocumentBuilder()
      .setTitle('Practice API')
      .setDescription('The Practice API description')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

   const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
   SwaggerModule.setup(swaggerDocPath, app, swaggerDocument, {
      swaggerOptions: {
         persistAuthorization: true,
      },
   });

   await app.listen(3000);
}

bootstrap();
