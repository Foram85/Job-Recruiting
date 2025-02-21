import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { EmployeeStatus } from '../interfaces/employee-status.interface';
import { EmployeeRole } from '../interfaces/employee-role.interface';

export class UpdateEmployeeDto {
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  hireDate?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(EmployeeStatus)
  employementStatus?: EmployeeStatus;

  @IsOptional()
  @IsNotEmpty()
  departmentId?: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
