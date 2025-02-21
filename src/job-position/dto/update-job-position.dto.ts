import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { PositionStatus } from '../interfaces/position-status.interface';
import { PositionType } from '../interfaces/position-type.interface';

export class UpdateJobPositionDto {
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsOptional()
  requirements?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(PositionType)
  positionType?: PositionType;

  @IsOptional()
  @IsNotEmpty()
  experienceLevel?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  minSalary?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  maxSalary?: number;

  @IsOptional()
  @IsNotEmpty()
  jobLocation?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PositionStatus)
  positionStatus?: PositionStatus;

  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsNotEmpty()
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  openingAt?: Date;

  @IsNotEmpty()
  @IsOptional()
  departmentId?: string;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  closingAt?: Date;

  @IsOptional()
  @IsNotEmpty()
  number_of_openings?: number;
}
