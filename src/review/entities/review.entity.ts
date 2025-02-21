import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { Employee } from 'src/employees/entities/employee.entity';
import { Interview } from 'src/interview/entities/interview.entity';
import { ReviewStatus } from '../interfaces/review-status.dto';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => formatDate(value))
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => formatDate(value))
  updated_at: Date;

  @Column({ type: 'timestamptz' })
  @Transform(({ value }) => formatDate(value))
  review_date: Date;

  @Column()
  review_text: string;

  @Column()
  isRecommended: boolean;

  @Column()
  technical_score: number;

  @Column()
  communication_score: number;

  @Column({ default: ReviewStatus.SUBMITTED })
  status: ReviewStatus;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE', eager: false })
  employee: Employee;

  @JoinColumn()
  @OneToOne(() => Interview, { onDelete: 'CASCADE', eager: false })
  interview: Interview;
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
