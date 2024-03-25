import { AccountsService } from 'src/accounts/accounts.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './order.entity';
import { OrdersRepository } from './orders.repository';
import { TrainingsService } from 'src/trainings/trainings.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly accountsService: AccountsService,
    private readonly trainingsService: TrainingsService,
  ) {}

  public async createNewOrder(
    userId: string,
    dto: CreateOrderDto,
  ): Promise<OrderEntity> {
    const { trainingId, trainingsCount } = dto;
    const existAccount = await this.accountsService.findByUserId(userId);
    if (!existAccount) {
      await this.accountsService.createNewAccount({
        userId,
        trainingId,
        trainingsActive: trainingsCount,
      });
    } else {
      await this.accountsService.addActiveTrainings(existAccount.id!, {
        trainingsCount,
      });
    }
    const { price: trainingPrice } =
      await this.trainingsService.getTrainingEntity(trainingId);
    const trainingSum = trainingPrice * trainingsCount;
    const newOrder = new OrderEntity({
      ...dto,
      userId,
      trainingPrice,
      trainingSum,
    });
    return await this.ordersRepository.save(newOrder);
  }
}
