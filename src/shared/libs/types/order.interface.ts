import { OrderType } from './order-type.enum';
import { Payment } from './payment.enum';

export interface Order {
  id?: string;
  orderType: OrderType;
  trainingId: string;
  price: number;
  quantity: number;
  sum: number;
  payment: Payment;
  createdAt: Date;
}
