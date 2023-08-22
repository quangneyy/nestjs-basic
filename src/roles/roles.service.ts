import { IUser } from 'src/users/users.interface';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()

export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>
  ) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;

    const isExist = await this.roleModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException(`Role với name="${name}" đã tồn tại!`)
    }

    const newRole = await this.roleModel.create({
      name, description, isActive, permissions,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return {
      _id: newRole?._id,
      createdAt: newRole?.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("not found role")
    }

    return (await this.roleModel.findById(id))
      .populate({
        path: "permissions",
        select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
      });
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("not found role")
    }

    const { name, description, isActive, permissions } = updateRoleDto;

    // const isExist = await this.roleModel.findOne({ name });
    // if (isExist) {
    //   throw new BadRequestException(`Role với name=${name} đã tồn tại!`)
    // }

    const updated = await this.roleModel.updateOne(
      { _id },
      {
        name, description, isActive, permissions,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );

    return updated;
  }

  async remove(id: string, user: IUser) {
    const foundRole = await this.roleModel.findById(id);
    if (foundRole.name === "ADMIN") {
      throw new BadRequestException("Không thể xoá role ADMIN")
    }
    await this.roleModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email
        }
      }
    )

    return this.roleModel.softDelete({
      _id: id
    })
  }
}
