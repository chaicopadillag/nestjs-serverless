import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { APIGatewayProxyResult, DynamoDBStreamEvent } from 'aws-lambda';

const sqsClient = new SQSClient({ region: process.env.APP_REGION });

@Injectable()
export class DeliveryService {
  async sendOrder(event: DynamoDBStreamEvent): Promise<APIGatewayProxyResult> {
    try {
      const { eventName, dynamodb } = event.Records[0];

      if (eventName !== 'MODIFY') {
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'No action needed',
          }),
        };
      }

      const order = dynamodb.NewImage;

      const body = {
        orderId: order.orderId.S,
        product: order.product.S,
        customer: order.customer.S,
        quantity: order.quantity.N,
        price: order.price.N,
        address: order.address.S,
        latitude: order.latitude.S,
        longitude: order.longitude.S,
        email: order.email.S,
        status: order.status.S,
      };

      console.log('🚚 Sending order to delivery service', JSON.stringify(body));

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
