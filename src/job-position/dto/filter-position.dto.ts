import { IsEnum, IsOptional } from 'class-validator';
import { PositionType } from '../interfaces/position-type.interface';
import { PositionStatus } from '../interfaces/position-status.interface';

export class filterPositionDto {
  @IsOptional()
  @IsEnum(PositionType)
  type?: string;

  @IsOptional()
  @IsEnum(PositionStatus)
  status?: string;

  @IsOptional()
  isRemote?: boolean;

  @IsOptional()
  search?: string;
}
