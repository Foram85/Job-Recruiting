import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCandidateDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}
