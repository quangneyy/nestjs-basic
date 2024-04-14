import { Injectable } from '@nestjs/common';
import { IUser } from 'src/users/users.interface';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from './schemas/job.schema';

@Injectable()
export class DataAccessService {
  constructor(
    private readonly jobModel: SoftDeleteModel<JobDocument>
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const {
      name, skills, company, salary, quantity, 
      level, description, startDate, endDate, 
      isActive, location
    } = createJobDto;

    const newJob = await this.jobModel.create({
      name, skills, company, salary, quantity, 
      level, description, startDate, endDate,
      isActive, location,
      createBy: {
        _id: user._id, 
        email: user.email
      }
    });

    return {
      _id: newJob?._id,
      createAt: newJob.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = await this.jobModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found job`;
    }
    
    const job = await this.jobModel.findById(id);
    return job || `not found job`;
  }

  async findAllJobByCompany(companyId: string) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return `not found job`;
    }

    const jobs = await this.jobModel.find({ 'company._id': companyId });
    return jobs;
  }

  async update(_id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const updated = await this.jobModel.findByIdAndUpdate(_id, {
      ...updateJobDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    }, { new: true });

    return updated || `not found job`;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return `not found job`;
    }

    const job = await this.jobModel.findById(_id);
    if (!job) {
      return `not found job`;
    }

    await job.updateOne({
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    
    await this.jobModel.softDelete({
      _id
    });

    return `job deleted successfully`;
  }
}
