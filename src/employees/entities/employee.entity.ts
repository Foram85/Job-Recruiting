import { Transform } from 'class-transformer';
import { Department } from 'src/department/entities/department.entity';
import { formatDate } from 'src/interview/entities/interview.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeStatus } from '../interfaces/employee-status.interface';
import { EmployeeRole } from '../interfaces/employee-role.interface';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  phone: string;

  @Column({ default: EmployeeStatus.FullTime })
  employment_status: EmployeeStatus;

  @Transform(({ value }) => formatDate(value))
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Transform(({ value }) => formatDate(value))
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ default: 'false' })
  is_active: boolean;

  @Column({ default: EmployeeRole.Employee })
  role: EmployeeRole;

  @Column({ type: 'timestamptz', name: 'hire_date' })
  @Transform(({ value }) => formatDate(value))
  hire_date: Date;

  @ManyToOne(() => Department, {
    onDelete: 'CASCADE',
    eager: false,
  })
  department: Department;
}
