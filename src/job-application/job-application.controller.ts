import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplication } from './entities/job-application.entity';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApplicationStatus } from './interfaces/application-status.interface';
import { RecruiterGuard } from 'src/recruiter.guard';
import { HiringManagerGuard } from 'src/hiring-manager.guard';
import { OfferDto } from './dto/offer.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';

@Controller('job-application')
export class JobApplicationController {
  constructor(private jobApplicationService: JobApplicationService) {}

  @Post()
  async create(
    @Body() createDto: CreateJobApplicationDto,
  ): Promise<JobApplication> {
    return this.jobApplicationService.addApplication(createDto);
  }

  @UseGuards(AuthGuard(), RecruiterGuard)
  @Post(':id/submit-to-hiring-manager')
  async submitToHiringManager(
    @Param('id') id: string,
    @Body('hiringMangerId') hiringMangerId: string,
  ): Promise<JobApplication> {
    return this.jobApplicationService.submitToHiringManager(id, hiringMangerId);
  }

  @UseGuards(AuthGuard(), RecruiterGuard)
  @Post(':id/offer-candidate')
  async sendOfferToCandidate(
    @Param('id') id: string,
    @Body() offerDto: OfferDto,
  ): Promise<JobApplication> {
    return this.jobApplicationService.sendOfferToCandidate(id, offerDto);
  }

  @UseGuards(AuthGuard(), RecruiterGuard)
  @Get()
  async getAll(
    @Query('status') status: ApplicationStatus,
  ): Promise<JobApplication[]> {
    return this.jobApplicationService.getAll(status);
  }

  @UseGuards(AuthGuard(), HiringManagerGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.jobApplicationService.getById(id);
  }

  @UseGuards(AuthGuard(), HiringManagerGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationDto,
  ): Promise<JobApplication> {
    return this.jobApplicationService.updateById(id, updateDto);
  }
}
