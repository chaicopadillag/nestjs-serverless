import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { QueueModule } from './queue.module';
import { QueueService } from './queue.service';

export const handler: Handler = async (event: APIGatewayProxyEvent) => {
  const appContext = await NestFactory.createApplicationContext(QueueModule);
  const eventsService = appContext.get(QueueService);
  console.log(event);
  return eventsService.getHello();
};
