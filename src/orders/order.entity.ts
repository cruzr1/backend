import { Order, OrderType, Payment } from 'src/shared/libs/types';

export class OrderEntity implements Order {
  id?: string;
  orderType: OrderType;
  userId: string;
  trainingId: string;
  trainingsCount: number;
  trainingPrice: number;
  trainingSum: number;
  payment: Payment;

  constructor(data: Order) {
    this.id = data.id;
    this.orderType = data.orderType;
    this.trainingId = data.trainingId;
    this.trainingsCount = data.trainingsCount;
    this.trainingPrice = data.trainingPrice;
    this.trainingSum = data.trainingSum;
    this.payment = data.payment;
  }

  public toPOJO(): Order {
    return {
      id: this.id,
      orderType: this.orderType,
      trainingId: this.trainingId,
      trainingsCount: this.trainingsCount,
      trainingPrice: this.trainingPrice,
      trainingSum: this.trainingSum,
      payment: this.payment,
    };
  }

  static fromObject(data: Order): OrderEntity {
    return new OrderEntity(data);
  }
}
