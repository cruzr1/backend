import { OrderType } from './order-type.enum';
import { Payment } from './payment.enum';

export interface Order {
  id?: string;
  userId: string;
  orderType: OrderType;
  trainingId: string;
  trainingsCount: number;
  trainingPrice: number;
  trainingSum: number;
  payment: Payment;
}
