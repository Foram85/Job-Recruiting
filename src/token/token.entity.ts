import { Employee } from 'src/employees/entities/employee.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export enum TokenType {
  CANDIDATE = 'candidate',
  EMPLOYEE = 'employee',
}

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;

  @Column({ name: 'expiry_date' })
  expiryDate: Date;

  @ManyToOne(() => Candidate, { nullable: true })
  candidate: Candidate;

  @ManyToOne(() => Employee, { nullable: true })
  employee: Employee;
}
