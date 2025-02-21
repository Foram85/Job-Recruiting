import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { PositionType } from '../interfaces/position-type.interface';

export class CreateJobPositionDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  requirements: string;

  @IsNotEmpty()
  @IsEnum(PositionType)
  position_type: PositionType;

  @IsNotEmpty()
  experience_level: string;

  @IsNotEmpty()
  @IsNumber()
  salary_min: number;

  @IsNotEmpty()
  @IsNumber()
  salary_max: number;

  @IsNotEmpty()
  job_location: string;

  @IsNotEmpty()
  @IsBoolean()
  isRemote: boolean;

  @IsNotEmpty()
  departmentId: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  openingAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  closingAt: Date;

  @IsNotEmpty()
  number_of_openings: number;
}
