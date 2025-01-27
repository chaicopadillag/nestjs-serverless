import { Injectable } from '@nestjs/common';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

@Injectable()
export class OrdersService {
  async createOrder(req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const body = JSON.parse(req.body);

    const newOrder = {
      id: Date.now(),
      ...body,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(newOrder),
    };
  }
}
