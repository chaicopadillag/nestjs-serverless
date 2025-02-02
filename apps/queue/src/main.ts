import { NestFactory } from '@nestjs/core';
import { Handler, SQSEvent } from 'aws-lambda';
import { QueueModule } from './queue.module';
import { QueueService } from './queue.service';

export const handler: Handler = async (event: SQSEvent) => {
  const appContext = await NestFactory.createApplicationContext(QueueModule);
  const eventsService = appContext.get(QueueService);
  return eventsService.processOrder(event);
};
