import { DepartmentService } from './../department/department.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPosition } from './entities/job-position.entity';
import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';
import { filterPositionDto } from './dto/filter-position.dto';

@Injectable()
export class JobPositionService {
  constructor(
    @InjectRepository(JobPosition)
    private jobPositionRepository: Repository<JobPosition>,
    private departmentRepository: DepartmentService,
  ) {}

  async createJobPosition(
    createDto: CreateJobPositionDto,
  ): Promise<JobPosition> {
    const department = await this.departmentRepository.findOneById(
      createDto.departmentId,
    );
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    const newPos = this.jobPositionRepository.create({ ...createDto });
    return await this.jobPositionRepository.save(newPos);
  }

  async save(position: JobPosition): Promise<JobPosition> {
    return this.jobPositionRepository.save(position);
  }

  async getById(id: string): Promise<JobPosition> {
    const position = this.jobPositionRepository.findOneBy({ id });
    if (!position) {
      throw new NotFoundException('position not found');
    }
    return position;
  }

  async getAllJobPositions(
    filterDto: filterPositionDto,
  ): Promise<JobPosition[]> {
    const { type, status, isRemote, search } = filterDto;
    const query = this.jobPositionRepository.createQueryBuilder('position');

    if (type) {
      query.andWhere('position.position_type = :type', { type });
    }

    if (isRemote) {
      query.andWhere('position.isRemote = :isRemote', { isRemote });
    }

    if (status) {
      query.andWhere('position.position_status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(position.title LIKE :search OR position.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async updateById(
    id: string,
    updateDto: UpdateJobPositionDto,
  ): Promise<JobPosition> {
    const existingPos = await this.getById(id);
    Object.assign(existingPos, updateDto);
    await this.jobPositionRepository.save(existingPos);
    return existingPos;
  }

  async deleteById(id: string) {
    return this.jobPositionRepository.delete({ id });
  }
}
