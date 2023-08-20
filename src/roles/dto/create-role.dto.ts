import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({
        message: "name không được để trống",
    })
    name: string;

    @IsNotEmpty({
        message: "description không được để trống",
    })
    description: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({
        message: "isActive không được để trống",
    })
    @IsBoolean({
        message: "isActive có giá trị boolean",
    })
    isActive: boolean;

    @IsNotEmpty({ message: 'permissions không được để trống', })
    @IsMongoId({ each: true, message: "each permission là mông object id" })
    @IsArray({ message: 'permissions có định dạnh là array', })
    permissions: mongoose.Schema.Types.ObjectId[];
}