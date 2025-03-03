import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate, Interview } from './entities/interview.entity';
import { Repository } from 'typeorm';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { JobApplicationService } from 'src/job-application/job-application.service';
import { ApplicationStatus } from 'src/job-application/interfaces/application-status.interface';
import { EmployeeRole } from 'src/employees/interfaces/employee-role.interface';
import { JobApplication } from 'src/job-application/entities/job-application.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { InterviewStatus } from './interfaces/interview-status.interface';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    private employeeRepository: EmployeesService,
    private applicationRepository: JobApplicationService,
    private emailService: EmailService,
  ) {}

  async create(createDto: CreateInterviewDto) {
    const [application, employee] = await Promise.all([
      this.applicationRepository.getById(createDto.applicationId),
      this.employeeRepository.getById(createDto.employeeId),
    ]);

    if (
      !application ||
      (application.status !== ApplicationStatus.APPROVED &&
        application.status !== ApplicationStatus.REVIEW)
    ) {
      throw new NotFoundException(
        'Application not found else it is not approved or reviewed yet.',
      );
    }

    let interview: Interview;
    if (createDto.round === 2) {
      if (employee.role !== EmployeeRole.HR) {
        throw new NotFoundException(
          'For round 2, the assigned employee must be HR.',
        );
      }
      interview = await this.interviewRepository.findOne({
        where: { application: { id: createDto.applicationId } },
      });
      if (!interview) {
        throw new NotFoundException('No existing interview found for round 2.');
      }
      interview.employee = employee;
      interview.status = InterviewStatus.SCHEDULED;
      interview.round = createDto.round;
      Object.assign(interview, createDto);
    } else {
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      interview = this.interviewRepository.create({
        ...createDto,
        application,
        employee,
      });
    }

    interview = await this.interviewRepository.save(interview);

    application.status = ApplicationStatus.INTERVIEW;
    application.hasReviewed = false;
    application.reviewerId = employee;
    await this.applicationRepository.save(application);

    await this.sendInterviewEmails(application, employee, interview);

    return interview;
  }

  private async sendInterviewEmails(
    application: JobApplication,
    employee: Employee,
    interview: Interview,
  ) {
    const candidateEmail = application.candidate
      ? application.candidate.email
      : application.candidateEmail;
    const candidateName = application.candidate
      ? application.candidate.name
      : application.candidateName;

    await this.emailService.sendInterviewDetailsToCandidate(
      candidateEmail,
      candidateName,
      {
        schedule_start_date: formatDate(interview.schedule_start_date),
        schedule_end_date: formatDate(interview.schedule_end_date),
        meeting_link: interview.meeting_link,
        round: interview.round,
        type: interview.type,
      },
    );

    await this.emailService.sendInterviewDetailsToInterviewer(
      employee.email,
      employee.name,
      candidateName,
      application.resumeUrl,
      {
        schedule_start_date: formatDate(interview.schedule_start_date),
        schedule_end_date: formatDate(interview.schedule_end_date),
        meeting_link: interview.meeting_link,
      },
    );
  }

  async save(interview: Interview): Promise<Interview> {
    return this.interviewRepository.save(interview);
  }

  async getAll(): Promise<Interview[]> {
    return this.interviewRepository.find();
  }

  async getById(id: string): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({
      where: { id },
      relations: ['employee', 'application', 'application.candidate'],
    });
    if (!interview) {
      throw new NotFoundException('Interview id not found');
    }
    return interview;
  }

  async updateById(
    id: string,
    updateDto: UpdateInterviewDto,
  ): Promise<Interview> {
    const interview = await this.getById(id);
    Object.assign(interview, updateDto);
    const updatedInterview = await this.interviewRepository.save(interview);
    if (
      interview.application &&
      interview.application.status !== ApplicationStatus.REJECTED
    ) {
      interview.application.status = ApplicationStatus.INTERVIEW;
      await this.sendInterviewEmails(
        interview.application,
        interview.employee,
        interview,
      );
      await this.applicationRepository.save(interview.application);
    }
    return updatedInterview;
  }

  async deleteById(id: string) {
    return this.interviewRepository.delete({ id });
  }
}
