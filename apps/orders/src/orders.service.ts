import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

const sqsClient = new SQSClient({ region: process.env.APP_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.APP_REGION });
const documentClient = DynamoDBDocumentClient.from(dynamoClient);

@Injectable()
export class OrdersService {
  async createOrder(req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const body = JSON.parse(req.body);

      const newOrder = {
        orderId: uuid(),
        ...body,
      };
      console.log('Start create new order with:', JSON.stringify(newOrder));

      const ortderItem = {
        TableName: process.env.ORDERS_TABLE_NAME,
        Item: newOrder,
      };
      const createOrderCommand = new PutCommand(ortderItem);
      const orderCreationResult = await documentClient.send(createOrderCommand);
      console.log(
        '🚚 Order created successully',
        JSON.stringify(orderCreationResult),
      );

      const params: SendMessageCommandInput = {
        QueueUrl: process.env.PENDING_ORDERS_QUEUE_URL,
        MessageBody: JSON.stringify(newOrder),
      };
      const orderMessageSender = new SendMessageCommand(params);
      const sqsOrderDeliveryResult = await sqsClient.send(orderMessageSender);

      console.log(
        '✅ Order sent to SQS',
        JSON.stringify(sqsOrderDeliveryResult),
      );

      return {
        statusCode: 200,
        body: JSON.stringify(newOrder),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      console.error('❌ Error creating order', error);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error creating order',
        }),
      };
    }
  }
}
