import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const sqsClient = new SQSClient({ region: process.env.APP_REGION });

@Injectable()
export class OrdersService {
  async createOrder(req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const body = JSON.parse(req.body);

      const newOrder = {
        id: Date.now(),
        ...body,
      };

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
