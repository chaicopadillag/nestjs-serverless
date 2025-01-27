import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { OrdersModule } from './orders.module';
import { OrdersService } from './orders.service';

export const handler: Handler = async (event: APIGatewayProxyEvent) => {
  const appContext = await NestFactory.createApplicationContext(OrdersModule);
  const eventsService = appContext.get(OrdersService);
  return eventsService.createOrder(event);
};
