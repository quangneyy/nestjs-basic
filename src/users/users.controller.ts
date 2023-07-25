import { Public } from './../decorator/customize';
import { IUser } from 'src/users/users.interface';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage("Create a new User") 
  async create(@Body() quangney: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(quangney, user); 
    return {
      _id: newUser?._id,
      createAt: newUser?.createdAt
    };
  }

  @Get()
  @ResponseMessage("Message user with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,) {
      return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Fetch user by id")
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }

  @ResponseMessage("Update a User")
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updatedUser = await this.usersService.update(updateUserDto, user);
    return updatedUser;
  }

  @Delete(':id')
  @ResponseMessage("Delete a User")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
