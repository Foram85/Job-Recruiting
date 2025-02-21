import { Candidate } from 'src/candidate/entities/candidate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationStatus } from '../interfaces/application-status.interface';
import { JobPosition } from 'src/job-position/entities/job-position.entity';
import { Employee } from 'src/employees/entities/employee.entity';

@Entity()
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  candidateEmail: string;

  @Column({ nullable: true })
  candidateName: string;

  @Column()
  coverLetter: string;

  @Column()
  expectedSalary: number;

  @Column()
  referralSource: string;

  @Column()
  resumeUrl: string;

  @Column({ default: ApplicationStatus.NEW })
  status: ApplicationStatus;

  @CreateDateColumn()
  appliedAt: Date;

  @Column({ default: false })
  hasReviewed: boolean;

  @ManyToOne(() => Candidate, (candidate) => candidate.applications, {
    eager: false,
    nullable: true,
  })
  @JoinColumn()
  candidate: Candidate;

  @ManyToOne(() => JobPosition, { onDelete: 'CASCADE', eager: true })
  position: JobPosition;

  @ManyToOne(() => Employee, { nullable: true, eager: true })
  @JoinColumn({ name: 'reviewer_id' })
  reviewerId: Employee;
}
