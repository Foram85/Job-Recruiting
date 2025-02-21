import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateJobApplicationDto {
  @IsOptional()
  @IsUUID()
  candidateId?: string;

  @IsOptional()
  @IsEmail()
  candidateEmail?: string;

  @IsOptional()
  @IsString()
  candidateName?: string;

  @IsNotEmpty()
  @IsString()
  coverLetter: string;

  @IsNotEmpty()
  @IsNumber()
  expectedSalary: number;

  @IsNotEmpty()
  @IsString()
  referralSource: string;

  @IsNotEmpty()
  @IsString()
  resumeUrl: string;

  @IsNotEmpty()
  @IsUUID()
  positionId: string;
}
