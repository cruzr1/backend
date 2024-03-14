import { Order, OrderType, Payment } from 'src/shared/libs/types';

export class OrderEntity implements Order {
  id?: string;
  orderType: OrderType;
  userId: string;
  trainingId: string;
  price: number;
  quantity: number;
  sum: number;
  payment: Payment;

  constructor(data: Order) {
    this.id = data.id;
    this.orderType = data.orderType;
    this.trainingId = data.trainingId;
    this.price = data.price;
    this.quantity = data.quantity;
    this.sum = data.sum;
    this.payment = data.payment;
  }

  public toPOJO(): Order {
    return {
      id: this.id,
      orderType: this.orderType,
      trainingId: this.trainingId,
      price: this.price,
      quantity: this.quantity,
      sum: this.sum,
      payment: this.payment,
    };
  }

  static fromObject(data: Order): OrderEntity {
    return new OrderEntity(data);
  }
}
