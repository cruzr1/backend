import { AccountsService } from 'src/accounts/account.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './order.entity';
import { OrdersRepository } from './orders.repository';

export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly accountsService: AccountsService,
  ) {}

  public async createNewOrder(dto: CreateOrderDto): Promise<OrderEntity> {
    const newOrder = new OrderEntity(dto);
    // const { userId, trainingId, trainingsCount } = dto;
    // await this.accountsService.createNewAccount({
    //   userId,
    //   trainingId,
    //   trainingsCount,
    // });
    return await this.ordersRepository.save(newOrder);
  }
}
