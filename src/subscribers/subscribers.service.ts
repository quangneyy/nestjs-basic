import { IUser } from './../users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>
  ) { }

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const {
      name, email, skills
    } = createSubscriberDto;
    const isExist = await this.subscriberModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng nhập lại`)
    }

    let newSubs = await this.subscriberModel.create({
      name, email, skills,
      createBy: {
        _id: user._id,
        email: user.email
      }
    })

    return {
      _id: newSubs?._id,
      createBy: newSubs?.createdBy
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.subscriberModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, // trang hien tai
        pageSize: limit, // So luong ban ghi da lay
        pages: totalPages, // tong so trang voi dieu kien query
        total: totalItems // tong so phan tu (so ban ghi)
      },
      result // ket qua query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found subscriber`;

    return await this.subscriberModel.findById(id);
  }

  async update(_id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    const updated = await this.subscriberModel.updateOne(
      { _id },
      {
        ...updateSubscriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return updated;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return `not found subscriber`;

    await this.subscriberModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.subscriberModel.softDelete({
      _id
    })
  }
}
