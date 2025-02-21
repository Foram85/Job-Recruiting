import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class OfferDto {
  @IsNotEmpty()
  offerLetterLink: string;

  @IsNotEmpty()
  joiningDate: string;

  @IsNumber()
  @IsOptional()
  salary?: number;
}
