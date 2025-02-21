import { JobApplication } from 'src/job-application/entities/job-application.entity';
import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationController } from './job-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateModule } from 'src/candidate/candidate.module';
import { JobPositionModule } from 'src/job-position/job-position.module';
import { EmailModule } from '../email/email.module';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication]),
    JobPositionModule,
    CandidateModule,
    EmployeesModule,
    EmailModule,
  ],
  providers: [JobApplicationService],
  controllers: [JobApplicationController],
  exports: [JobApplicationService],
})
export class JobApplicationModule {}
