import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createDto: CreateDepartmentDto): Promise<Department> {
    const existingDep = await this.departmentRepository.findOneBy({
      name: createDto.name,
    });

    if (existingDep) {
      throw new ConflictException('This department already exists');
    }

    const newDepartment = this.departmentRepository.create({
      ...createDto,
    });

    return this.departmentRepository.save(newDepartment);
  }

  async findOneById(id: string): Promise<Department> {
    return this.departmentRepository.findOneBy({ id });
  }

  async save(department: Department): Promise<Department> {
    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
  }

  async deleteById(id: string) {
    return this.departmentRepository.delete({ id });
  }
}
