import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const sqsClient = new SQSClient({ region: process.env.APP_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.APP_REGION });
const documentClient = DynamoDBDocumentClient.from(dynamoClient);

@Injectable()
export class DeliveryService {
  async sendOrder(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const body = JSON.parse(event.body);
      console.log('🚚 Order sent to delivery service', JSON.stringify(body));

      const ortderItem = {
        TableName: process.env.ORDERS_TABLE_NAME,
        Item: body,
      };
      const createOrderCommand = new PutCommand(ortderItem);
      const orderCreationResult = await documentClient.send(createOrderCommand);
      console.log('🚚 Order created', JSON.stringify(orderCreationResult));

      const deliveryQueueParams = {
        QueueUrl: process.env.DELIVERY_PENDING_ORDERS_QUEUE_URL,
        MessageBody: JSON.stringify(body),
      };

      const sendMessageCommand = new SendMessageCommand(deliveryQueueParams);
      const deliveryMessageResult = await sqsClient.send(sendMessageCommand);

      console.log(
        '🚚 Order sent to delivery service',
        JSON.stringify(deliveryMessageResult),
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Order sent to delivery service',
        }),
      };
    } catch (error) {
      console.error('🚚 Error sending order to delivery service', error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error sending order to delivery service',
        }),
      };
    }
  }
}
