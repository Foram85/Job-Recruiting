import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobPositionService } from './job-position.service';
import { JobPosition } from './entities/job-position.entity';
import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';
import { filterPositionDto } from './dto/filter-position.dto';
import { AuthGuard } from '@nestjs/passport';
import { HiringManagerGuard } from 'src/hiring-manager.guard';

@UseGuards(AuthGuard())
@Controller('job-position')
export class JobPositionController {
  constructor(private jobPositionService: JobPositionService) {}

  @UseGuards(HiringManagerGuard)
  @Post('register')
  async create(@Body() createDto: CreateJobPositionDto): Promise<JobPosition> {
    return this.jobPositionService.createJobPosition(createDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<JobPosition> {
    return this.jobPositionService.getById(id);
  }

  @UseGuards(HiringManagerGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: UpdateJobPositionDto,
  ): Promise<JobPosition> {
    return this.jobPositionService.updateById(id, updateDto);
  }

  @Get()
  async getAll(@Query() filterDto: filterPositionDto): Promise<JobPosition[]> {
    return this.jobPositionService.getAllJobPositions(filterDto);
  }

  @UseGuards(HiringManagerGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.jobPositionService.deleteById(id);
  }
}
