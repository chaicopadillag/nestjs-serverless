import { Injectable } from '@nestjs/common';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

@Injectable()
export class OrderService {
  async getOrderById(
    event: APIGatewayProxyEvent,
  ): Promise<APIGatewayProxyResult> {
    const { orderId = '00' } = event.pathParameters;

    return {
      statusCode: 200,
      body: JSON.stringify({
        orderId,
        status: 'PENDING',
      }),
    };
  }
}
