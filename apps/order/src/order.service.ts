import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoClient = new DynamoDBClient({ region: process.env.APP_REGION });
const documentClient = DynamoDBDocumentClient.from(dynamoClient);

@Injectable()
export class OrderService {
  async getOrderById(
    event: APIGatewayProxyEvent,
  ): Promise<APIGatewayProxyResult> {
    try {
      const { orderId = '00' } = event.pathParameters;
      console.log('🚚 Getting order by id:', orderId);

      const params = {
        TableName: process.env.ORDERS_TABLE_NAME,
        Key: { orderId },
      };

      const getOrderCommand = new GetCommand(params);
      const orderResult = await documentClient.send(getOrderCommand);
      console.log('✅ Order retrieved:', JSON.stringify(orderResult));

      return {
        statusCode: 200,
        body: JSON.stringify(orderResult.Item),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      console.error('❌ Error getting order:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error getting order' }),
      };
    }
  }
}
