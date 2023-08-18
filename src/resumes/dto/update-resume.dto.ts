import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { CreateResumeDto } from './create-resume.dto';

class UpdatedBy {
    @IsNotEmpty()
    _id: Types.ObjectId;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

class History {
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    updatedAt: Date;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => UpdatedBy)
    updatedBy: UpdatedBy;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @IsNotEmpty({ message: 'history không được để trống', })
    @IsArray({ message: 'history không được để trống', })
    @ValidateNested()
    @Type(() => History)
    history: History[];
}