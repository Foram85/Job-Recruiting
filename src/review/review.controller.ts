import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { employeeGuard } from 'src/Employee.guard';

UseGuards(AuthGuard(), employeeGuard);
@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('register')
  async create(@Body() createDto: CreateReviewDto): Promise<Review> {
    return this.reviewService.create(createDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Review> {
    return this.reviewService.getById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewService.updateById(id, updateDto);
  }

  @Get()
  async getAll(): Promise<Review[]> {
    return this.reviewService.getAll();
  }

  @Delete()
  async deleteById(@Param('id') id: string) {
    return this.reviewService.deleteById(id);
  }
}
