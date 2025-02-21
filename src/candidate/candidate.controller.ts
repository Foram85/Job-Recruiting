import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { Candidate } from './entities/candidate.entity';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { JobApplication } from 'src/job-application/entities/job-application.entity';
import { AuthGuard } from '@nestjs/passport';
import { CandidateGuard } from 'src/candidate.guard';
import { RecruiterGuard } from 'src/recruiter.guard';

@Controller('candidate')
export class CandidateController {
  constructor(private candidateService: CandidateService) {}

  @Post()
  async create(
    @Body() body: { email: string; token: string; password: string },
  ): Promise<{ accessToken: string; applications: JobApplication[] }> {
    return this.candidateService.setPassword(
      body.email,
      body.token,
      body.password,
    );
  }

  @Post('forgot-password/:id')
  async forgotPassword(@Param('id') id: string): Promise<void> {
    return this.candidateService.forgotPassword(id);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; token: string; newPassword: string },
  ): Promise<{ applications: JobApplication[] }> {
    return this.candidateService.setPassword(
      body.email,
      body.token,
      body.newPassword,
    );
  }

  @UseGuards(AuthGuard(), RecruiterGuard)
  @Get()
  async getAll(): Promise<Candidate[]> {
    return this.candidateService.findAll();
  }

  @UseGuards(AuthGuard(), RecruiterGuard)
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Candidate> {
    return this.candidateService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), CandidateGuard)
  async updateOneById(
    @Param('id') id: string,
    @Body() updateDto: UpdateCandidateDto,
    @Request() req,
  ): Promise<Candidate> {
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.candidateService.updateOneById(id, updateDto);
  }

  @UseGuards(AuthGuard(), CandidateGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string, @Request() req) {
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only delete your own profile');
    }
    return this.candidateService.deleteById(id);
  }
}
