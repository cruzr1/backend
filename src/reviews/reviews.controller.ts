import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Get,
  Query,
  Req,
  Param,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewRdo } from './rdo/review.rdo';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { CheckAuthGuard } from 'src/shared/guards/check-auth.guard';
import { RoleGuard } from 'src/shared/guards/check-role.guard';
import { IndexReviewsQuery } from 'src/shared/query/index-reviews.query';
import {
  UserRole,
  EntitiesWithPaginationRdo,
  RequestWithUser,
} from 'src/shared/libs/types';
import { MongoIdValidationPipe } from 'src/shared/pipes/mongo-id-validation.pipe';

@ApiBearerAuth()
@ApiTags('Сервис отзывов')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ description: 'Заполнить базу данных начальными значениями' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The reviews data have been seeded.',
  })
  @ApiParam({
    name: 'count',
    description: 'Количество записей',
  })
  @Get('seed/:count')
  public async seedDatabase(@Param('count') count: number): Promise<void> {
    await this.reviewsService.seedReviewsDatabase(count);
  }

  @ApiOperation({ description: 'Список отзывов к тренировке' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The following reviews have been found.',
  })
  @UseGuards(CheckAuthGuard)
  @Get(':trainingId')
  public async index(
    @Param('trainingId', MongoIdValidationPipe) trainingId: string,
    @Query() query?: IndexReviewsQuery,
  ): Promise<EntitiesWithPaginationRdo<ReviewRdo>> {
    const reviewsWithPagination = await this.reviewsService.indexReviews(
      trainingId,
      query,
    );
    return {
      ...reviewsWithPagination,
      entities: reviewsWithPagination.entities.map((review) =>
        fillDTO(ReviewRdo, review),
      ),
    };
  }

  @ApiOperation({ description: 'Создание отзыва к тренировке' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new review has been created.',
  })
  @ApiParam({
    name: 'trainingId',
    description: 'Id тренировки',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Post(':trainingId')
  public async create(
    @Req() { user: { id } }: RequestWithUser,
    @Param('trainingId', MongoIdValidationPipe) trainingId: string,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewRdo> {
    const newReview = await this.reviewsService.createNewReview(
      id!,
      trainingId,
      dto,
    );
    return fillDTO(ReviewRdo, newReview);
  }
}
