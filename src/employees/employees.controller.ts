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
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee } from './entities/employee.entity';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from '@nestjs/passport';
import { HrGuard } from 'src/HR.guard';
import { employeeGuard } from 'src/Employee.guard';

@Controller('employees')
export class EmployeesController {
  constructor(private employeeService: EmployeesService) {}

  @UseGuards(AuthGuard(), HrGuard)
  @Post('register')
  async addEmp(@Body() createDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeeService.addEmployee(createDto);
  }

  @Post()
  async login(
    @Body() body: { token: string; email: string; password: string },
  ): Promise<{ accessToken: string }> {
    return this.employeeService.login(body.email, body.token, body.password);
  }

  @UseGuards(AuthGuard(), employeeGuard)
  @Get()
  async getEmployees(): Promise<Employee[]> {
    return this.employeeService.getAll();
  }

  @UseGuards(AuthGuard(), employeeGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.employeeService.getById(id);
  }

  @UseGuards(AuthGuard(), HrGuard)
  @Patch(':id')
  async updateOneById(
    @Param('id') id: string,
    @Body() updateDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.updateById(id, updateDto);
  }

  @UseGuards(AuthGuard(), HrGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.employeeService.deleteById(id);
  }
}
