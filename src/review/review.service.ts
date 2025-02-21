import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from 'src/employees/employees.service';
import { InterviewService } from 'src/interview/interview.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JobApplicationService } from 'src/job-application/job-application.service';
import { ApplicationStatus } from 'src/job-application/interfaces/application-status.interface';
import { InterviewStatus } from 'src/interview/interfaces/interview-status.interface';
import { ReviewStatus } from './interfaces/review-status.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private employeeService: EmployeesService,
    private interviewService: InterviewService,
    private jobApplicationService: JobApplicationService,
  ) {}

  async create(createDto: CreateReviewDto): Promise<Review> {
    const [employee, interview] = await Promise.all([
      this.employeeService.getById(createDto.employeeId),
      this.interviewService.getById(createDto.interviewId),
    ]);

    if (!employee) throw new NotFoundException('Employee not found');
    if (!interview) throw new NotFoundException('Interview not found');

    let review = await this.reviewRepository.findOne({
      where: { interview: { id: interview.id } },
    });
    review = review
      ? Object.assign(review, createDto, { employee, interview })
      : this.reviewRepository.create({ ...createDto, employee, interview });

    review.status = ReviewStatus.SUBMITTED;
    interview.status = InterviewStatus.COMPLETED;

    if (review.isRecommended === false) {
      interview.application.status = ApplicationStatus.REJECTED;
    } else {
      interview.application.status = ApplicationStatus.REVIEW;
    }
    interview.application.hasReviewed = true;
    await this.jobApplicationService.save(interview.application);

    await this.interviewService.save(interview);
    return this.reviewRepository.save(review);
  }

  async getAll(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['interview', 'interview.application'],
    });
  }

  async getById(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['interview', 'interview.application'],
    });
    if (!review) throw new NotFoundException('Review not found.');
    return review;
  }

  async updateById(id: string, updateDto: UpdateReviewDto): Promise<Review> {
    const review = await this.getById(id);
    Object.assign(review, updateDto);
    const updatedReview = await this.reviewRepository.save(review);

    const application = review.interview?.application;
    if (application) {
      if (application.status === ApplicationStatus.REJECTED) {
        if (updateDto) {
          throw new NotFoundException('This application is already rejected.');
        }
      } else {
        application.status = updateDto.isRecommended
          ? ApplicationStatus.REVIEW
          : ApplicationStatus.REJECTED;
        await this.jobApplicationService.save(application);
      }
    }
    return updatedReview;
  }

  async deleteById(id: string): Promise<string> {
    await this.reviewRepository.delete({ id });
    return 'Deleted successfully';
  }
}
