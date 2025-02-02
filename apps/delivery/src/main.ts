import { NestFactory } from '@nestjs/core';
import { DeliveryModule } from './delivery.module';
import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { DeliveryService } from './delivery.service';

export const handler: Handler = async (event: APIGatewayProxyEvent) => {
  const appContext = await NestFactory.createApplicationContext(DeliveryModule);
  const eventsService = appContext.get(DeliveryService);
  return eventsService.sendOrder(event);
};
