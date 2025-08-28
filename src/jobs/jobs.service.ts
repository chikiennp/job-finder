import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'src/database/entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async create(userId: number, createJobDto: CreateJobDto): Promise<Job> {
    const job = {
      ...createJobDto,
      employerId: userId,
      createdBy: userId,
    };
    return await this.jobRepository.save(job);
  }

  async findById(id: number): Promise<Job | null> {
    return this.jobRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Job[]> {
    return this.jobRepository.find();
  }

  async update(
    id: number,
    userId: number,
    updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    const job = await this.jobRepository.findOneBy({ id });
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    const updatedJob = {
      ...job,
      ...updateJobDto,
      employerId: userId,
      updatedBy: userId,
    };
    return await this.jobRepository.save(updatedJob);
  }

  remove(id: number) {
    return this.jobRepository.delete(id);
  }
}
