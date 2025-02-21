import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentService } from './department.service';
import { AuthGuard } from '@nestjs/passport';
import { HrGuard } from 'src/HR.guard';

@UseGuards(AuthGuard(), HrGuard)
@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Post('register')
  async create(@Body() createDto: CreateDepartmentDto): Promise<Department> {
    return this.departmentService.create(createDto);
  }

  @Get()
  async getAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Department> {
    return this.departmentService.findOneById(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.departmentService.deleteById(id);
  }
}
