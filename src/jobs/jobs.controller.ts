import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(
    @User('sub') userId: number,
    @Body() createJobDto: CreateJobDto,
  ) {
    return await this.jobsService.create(userId, createJobDto);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @User('sub') userId: number,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return await this.jobsService.update(id, userId, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.remove(id);
  }
}
