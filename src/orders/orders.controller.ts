import { Body, Controller, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderRdo } from './rdo/order.rdo';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { CheckAuthGuard } from 'src/shared/guards/check-auth.guard';
import { RoleGuard } from 'src/shared/guards/check-role.guard';
import { UserRole } from 'src/shared/libs/types';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new order has been created.',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Post('/')
  public async create(@Body() dto: CreateOrderDto): Promise<OrderRdo> {
    const newOrder = await this.ordersService.createNewOrder(dto);
    return fillDTO(OrderRdo, newOrder.toPOJO());
  }
}
