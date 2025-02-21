import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID()
  interviewId: string;

  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @IsNotEmpty()
  review_text: string;

  @IsNotEmpty()
  review_date: Date;

  @IsNotEmpty()
  @IsBoolean()
  isRecommended: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  communication_score?: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  technical_score?: number;
}
