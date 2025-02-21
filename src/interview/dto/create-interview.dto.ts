import { InterviewType } from './../interfaces/interview-type';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateInterviewDto {
  @IsNotEmpty()
  @IsUUID()
  applicationId: string;

  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @IsNotEmpty()
  meeting_link: string;

  @IsNotEmpty()
  schedule_start_date: Date;

  @IsNotEmpty()
  schedule_end_date: Date;

  @IsNotEmpty()
  @IsEnum(InterviewType)
  type: InterviewType;

  @IsNotEmpty()
  round: number;
}
