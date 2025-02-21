import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ReviewStatus } from '../interfaces/review-status.dto';

export class UpdateReviewDto {
  @IsNotEmpty()
  @IsOptional()
  @IsUUID()
  interviewId?: string;

  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  employeeId?: string;

  @IsOptional()
  @IsNotEmpty()
  reviewText?: string;

  @IsOptional()
  @IsNotEmpty()
  reviewDate?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isRecommended?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  communicationScore?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  technicalScore?: number;
}
