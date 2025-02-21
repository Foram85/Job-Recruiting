import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InterviewStatus } from '../interfaces/interview-status.interface';
import { Transform } from 'class-transformer';
import { Employee } from 'src/employees/entities/employee.entity';
import { InterviewType } from '../interfaces/interview-type';
import { JobApplication } from 'src/job-application/entities/job-application.entity';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => formatDate(value))
  created_at: Date;

  @Column({ type: 'timestamptz' })
  @Transform(({ value }) => formatDate(value))
  schedule_start_date: Date;

  @Column({ type: 'timestamptz' })
  @Transform(({ value }) => formatDate(value))
  schedule_end_date: Date;

  @Column({ default: InterviewStatus.SCHEDULED })
  status: InterviewStatus;

  @Column()
  type: InterviewType;

  @Column()
  meeting_link: string;

  @Column()
  round: number;

  @JoinColumn()
  @OneToOne(() => JobApplication, { onDelete: 'CASCADE', eager: true })
  application: JobApplication;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE', eager: false })
  employee: Employee;
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
