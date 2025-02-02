import { NestFactory } from '@nestjs/core';
import { DynamoDBStreamEvent, Handler } from 'aws-lambda';
import { DeliveryModule } from './delivery.module';
import { DeliveryService } from './delivery.service';

export const handler: Handler = async (event: DynamoDBStreamEvent) => {
  const appContext = await NestFactory.createApplicationContext(DeliveryModule);
  const eventsService = appContext.get(DeliveryService);
  return eventsService.sendOrder(event);
};
