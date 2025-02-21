import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from 'src/department/entities/department.entity';
import { Transform } from 'class-transformer';
import { PositionType } from '../interfaces/position-type.interface';
import { PositionStatus } from '../interfaces/position-status.interface';

@Entity()
export class JobPosition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  requirements: string;

  @Column()
  position_type: PositionType;

  @Column()
  experience_level: string;

  @Column()
  salary_min: number;

  @Column()
  salary_max: number;

  @Column()
  job_location: string;

  @Column({ default: PositionStatus.OPEN })
  position_status: PositionStatus;

  @Column({ default: false })
  is_remote: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => formatDate(value))
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => formatDate(value))
  updated_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => formatDate(value))
  opening_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => formatDate(value))
  closing_at: Date;

  @Column()
  number_of_openings: number;

  @ManyToOne(() => Department, { onDelete: 'CASCADE', eager: false })
  department: Department;
}

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
