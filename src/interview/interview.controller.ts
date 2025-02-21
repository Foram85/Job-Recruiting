import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { Interview } from './entities/interview.entity';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { AuthGuard } from '@nestjs/passport';
import { RecruiterGuard } from 'src/recruiter.guard';

@UseGuards(AuthGuard(), RecruiterGuard)
@Controller('interview')
export class InterviewController {
  constructor(private interviewService: InterviewService) {}

  @Post('register')
  async create(@Body() createDto: CreateInterviewDto): Promise<Interview> {
    return this.interviewService.create(createDto);
  }

  @Get()
  async getAll(): Promise<Interview[]> {
    return this.interviewService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Interview> {
    return this.interviewService.getById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: UpdateInterviewDto,
  ): Promise<Interview> {
    return this.interviewService.updateById(id, updateDto);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.interviewService.deleteById(id);
  }
}
