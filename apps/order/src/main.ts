import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { OrderModule } from './order.module';
import { OrderService } from './order.service';

export const handler: Handler = async (event: APIGatewayProxyEvent) => {
  const appContext = await NestFactory.createApplicationContext(OrderModule);
  const eventsService = appContext.get(OrderService);
  return eventsService.getOrderById(event);
};
