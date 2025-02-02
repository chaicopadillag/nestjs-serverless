import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { SQSEvent } from 'aws-lambda';

const dynamoClient = new DynamoDBClient({ region: process.env.APP_REGION });
const documentClient = DynamoDBDocumentClient.from(dynamoClient);

@Injectable()
export class QueueService {
  async processOrder(event: SQSEvent) {
    try {
      const order = JSON.parse(event.Records[0].body);
      console.log('🚚 Order received:', JSON.stringify(order));

      const updateStatusOrder: UpdateCommandInput = {
        TableName: process.env.ORDERS_TABLE_NAME,
        Key: { orderId: order.orderId },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': 'PROCESSED' },
      };

      const updatedOrder = new UpdateCommand(updateStatusOrder);
      const updateResult = await documentClient.send(updatedOrder);
      console.log('✅ Order updated:', JSON.stringify(updateResult));
    } catch (error) {
      console.error('❌ Error processing order:', error);
    }
  }
}
