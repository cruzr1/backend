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
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewRdo } from './rdo/review.rdo';
import { fillDTO } from 'src/shared/libs/utils/helpers';
import { CheckAuthGuard } from 'src/shared/guards/check-auth.guard';
import { RoleGuard } from 'src/shared/guards/check-role.guard';
import { IndexReviewsQuery } from 'src/shared/query/index-reviews.query';
import {
  UserRole,
  EntitiesWithPaginationRdo,
  RequestWithTokenPayload,
} from 'src/shared/libs/types';
import { MongoIdValidationPipe } from 'src/shared/pipes/mongo-id-validation.pipe';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The following reviews have been found.',
  })
  @UseGuards(CheckAuthGuard)
  @Get('/')
  public async index(
    @Query() query?: IndexReviewsQuery,
  ): Promise<EntitiesWithPaginationRdo<ReviewRdo>> {
    const reviewsWithPagination = await this.reviewsService.indexReviews(query);
    return {
      ...reviewsWithPagination,
      entities: reviewsWithPagination.entities.map((review) =>
        fillDTO(ReviewRdo, review.toPOJO()),
      ),
    };
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new review has been created.',
  })
  @UseGuards(CheckAuthGuard)
  @UseGuards(RoleGuard(UserRole.User))
  @Post(':trainingId')
  public async create(
    @Req() { user: { sub } }: RequestWithTokenPayload,
    @Param('trainingId', MongoIdValidationPipe) trainingId: string,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewRdo> {
    const newReview = await this.reviewsService.createNewReview(
      sub!,
      trainingId,
      dto,
    );
    return fillDTO(ReviewRdo, newReview.toPOJO());
  }
}
