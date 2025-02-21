import { ApplicationStatus } from './../interfaces/application-status.interface';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateApplicationDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}
