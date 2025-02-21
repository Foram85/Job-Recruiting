import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from './entities/job-application.entity';
import { JobPositionService } from 'src/job-position/job-position.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CandidateService } from 'src/candidate/candidate.service';
import { EmployeesService } from 'src/employees/employees.service';
import { EmployeeRole } from 'src/employees/interfaces/employee-role.interface';
import { EmailService } from '../email/email.service';
import { ApplicationStatus } from './interfaces/application-status.interface';
import { PositionStatus } from 'src/job-position/interfaces/position-status.interface';
import { OfferDto } from './dto/offer.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { JobPosition } from 'src/job-position/entities/job-position.entity';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    private jobPositionRepository: JobPositionService,
    private candidateService: CandidateService,
    private employeeRepository: EmployeesService,
    private emailService: EmailService,
  ) {}

  async submitToHiringManager(
    id: string,
    hiringManagerId: string,
  ): Promise<JobApplication> {
    const application = await this.getById(id);
    const hiringManger = await this.employeeRepository.getById(hiringManagerId);
    if (!hiringManger || hiringManger.role !== EmployeeRole.HiringManager) {
      throw new NotFoundException('Hiring Manger Not Found');
    }
    application.reviewerId = hiringManger;
    application.status = ApplicationStatus.SCREENING;
    const updatedApplication =
      await this.jobApplicationRepository.save(application);

    const candidateName = application.candidate
      ? application.candidate.name
      : application.candidateName;

    await this.emailService.sendNewApplicationNotification(
      hiringManger.email,
      candidateName,
      application.id,
    );
    return updatedApplication;
  }

  async sendOfferToCandidate(
    id: string,
    offerDto: OfferDto,
  ): Promise<JobApplication> {
    const application = await this.getById(id);
    if (application.status !== ApplicationStatus.REVIEW) {
      throw new BadRequestException(
        'Application must be reviewed before sending an offer',
      );
    }
    const candidateEmail = application.candidate
      ? application.candidate.email
      : application.candidateEmail;
    const candidateName = application.candidate
      ? application.candidate.name
      : application.candidateName;
    await this.emailService.sendOfferToCandidate(
      candidateEmail,
      candidateName,
      {
        offerLetterLink: offerDto.offerLetterLink,
        salary: offerDto.salary,
        joiningDate: offerDto.joiningDate,
        positionName: application.position.title,
      },
    );
    application.status = ApplicationStatus.OFFER;
    return await this.jobApplicationRepository.save(application);
  }

  async addApplication(
    createDto: CreateJobApplicationDto,
  ): Promise<JobApplication> {
    const position = await this.jobPositionRepository.getById(
      createDto.positionId,
    );
    if (!position) throw new NotFoundException('Position not found');

    if (createDto.candidateId) {
      return this.addRegisteredCandidateApplication(createDto, position);
    }
    if (!createDto.candidateEmail || !createDto.candidateName) {
      throw new BadRequestException(
        'Candidate email and name are required for unregistered users',
      );
    }

    if (createDto.candidateEmail) {
      const existingCandidate = await this.candidateService.findByEmail(
        createDto.candidateEmail,
      );

      if (existingCandidate) {
        throw new BadRequestException(
          `This email is already registered. Please provide the candidateId (${existingCandidate.id}) instead.`,
        );
      }
    }

    return this.addUnregisteredCandidateApplication(createDto, position);
  }

  private async addRegisteredCandidateApplication(
    createDto: CreateJobApplicationDto,
    position: JobPosition,
  ): Promise<JobApplication> {
    const candidate = await this.candidateService.findOneById(
      createDto.candidateId,
    );
    if (!candidate) throw new NotFoundException('Candidate not found');

    const existingApp = await this.jobApplicationRepository.findOne({
      where: {
        position: { id: createDto.positionId },
        candidate: { id: createDto.candidateId },
      },
    });
    if (existingApp) {
      throw new BadRequestException(
        'Candidate has already applied for this position',
      );
    }

    const application = this.jobApplicationRepository.create({
      ...createDto,
      candidate,
      candidateEmail: candidate.email,
      candidateName: candidate.name,
      position,
    });
    return await this.jobApplicationRepository.save(application);
  }

  private async addUnregisteredCandidateApplication(
    createDto: CreateJobApplicationDto,
    position: JobPosition,
  ): Promise<JobApplication> {
    // We already checked this in the main method, but double-checking for safety
    if (!createDto.candidateEmail || !createDto.candidateName) {
      throw new BadRequestException(
        'Candidate email and name are required for unregistered users',
      );
    }

    const existingApp = await this.jobApplicationRepository.findOne({
      where: {
        position: { id: createDto.positionId },
        candidateEmail: createDto.candidateEmail,
      },
    });
    if (existingApp) {
      throw new BadRequestException(
        'Candidate has already applied for this position',
      );
    }

    const application = this.jobApplicationRepository.create({
      ...createDto,
      candidateEmail: createDto.candidateEmail,
      candidateName: createDto.candidateName,
      candidate: null,
      position,
    });
    await this.candidateService.sendInvitation(
      createDto.candidateEmail,
      createDto.candidateName,
    );
    return await this.jobApplicationRepository.save(application);
  }

  async save(application: JobApplication): Promise<JobApplication> {
    return this.jobApplicationRepository.save(application);
  }

  async getAll(status: ApplicationStatus): Promise<JobApplication[]> {
    const query =
      this.jobApplicationRepository.createQueryBuilder('application');
    if (status) {
      query.andWhere('application.status = :status', { status });
    }
    return query.getMany();
  }

  async getById(id: string): Promise<JobApplication> {
    const apl = this.jobApplicationRepository.findOneBy({ id });
    if (!apl) {
      throw new NotFoundException('Application not found');
    }
    return apl;
  }

  async updateById(
    id: string,
    updateDto: UpdateApplicationDto,
  ): Promise<JobApplication> {
    const apl = await this.getById(id);
    Object.assign(apl, updateDto);
    if (updateDto.status === ApplicationStatus.HIRED) {
      const position = await this.jobPositionRepository.getById(
        apl.position.id,
      );
      position.number_of_openings = Math.max(
        0,
        position.number_of_openings - 1,
      );
      if (position.number_of_openings === 0) {
        position.position_status = PositionStatus.FILLED;
      }
      await this.jobPositionRepository.save(position);
    }
    return await this.jobApplicationRepository.save(apl);
  }
}
