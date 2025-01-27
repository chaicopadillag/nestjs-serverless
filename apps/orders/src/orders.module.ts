import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Module({
  imports: [],
  controllers: [],
  providers: [OrdersService],
})
export class OrdersModule {}
