import { IUser } from 'src/users/users.interface';
import { User as UserM, UserDocument } from './schemas/user.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from '..//decorator/customize';
import aqp from 'api-query-params';
import { USER_ROLE } from '../databases/sample';
import { Role, RoleDocument } from '../roles/schemas/role.schema';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(UserM.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>
  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const {
      name, email, password, age,
      gender, address, role, company
    } = createUserDto;

    // add logic check email
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
    }

    const hashPassword = this.getHashPassword(password);

    let newUser = await this.userModel.create({
      name, email,
      password: hashPassword,
      age,
      gender, address, role, company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, // tranh hien tai 
        pageSize: limit, // so luong ban ghi da lay
        pages: totalPages, // tong so trang voi dieu kiem query
        total: totalItems // tonf so phan tu (so ban ghi)
      },
      result // ket qua query
    }
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;

    return this.userModel.findOne({
      _id: id
    })
      .select("-password") // exclude >< include
      .populate({ path: "role", select: { name: 1, _id: 1 } })
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    }).populate({
      path: "role",
      select: { name: 1 }
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash); // false
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const updated = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return updated;
  }
  

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;

    const foundUser = await this.userModel.findById(id);
    if (foundUser && foundUser.email === "admin@gmail.com") {
      throw new BadRequestException("Không thể xoá tài khoản admin@gmail.com")
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    return this.userModel.softDelete({
      _id: id
    });
  }

  updatedUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken }
    )
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
      .populate({
        path: "role",
        select: { name: 1 }
      });
  }

    async register(user: RegisterUserDto) {
      const { name, email, password, age, gender, address } = user;
      const isExist = await this.userModel.findOne({ email });
      if (isExist) {
        throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
      }
      const userRole = await this.roleModel.findOne({ name: USER_ROLE });

      const hashPassword = this.getHashPassword(password);
      let newRegister = await this.userModel.create({
        name, email,
        password: hashPassword,
        age,
        gender,
        address,
        role: userRole?._id
      })
      return newRegister;
    }
}
