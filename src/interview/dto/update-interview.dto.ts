import { InterviewType } from '../interfaces/interview-type';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateInterviewDto {
  @IsOptional()
  @IsNotEmpty()
  meetingLink?: string;

  @IsNotEmpty()
  @IsOptional()
  scheduleStartDate?: Date;

  @IsNotEmpty()
  @IsOptional()
  scheduleEndDate?: Date;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum({ InterviewType })
  type?: InterviewType;

  @IsNotEmpty()
  @IsOptional()
  round?: number;
}
