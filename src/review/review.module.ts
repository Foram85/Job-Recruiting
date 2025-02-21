import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { InterviewModule } from 'src/interview/interview.module';
import { JobApplicationModule } from 'src/job-application/job-application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    EmployeesModule,
    InterviewModule,
    JobApplicationModule,
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
