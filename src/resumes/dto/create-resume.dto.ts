import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty({
        message: "email không được để trống",
    })
    email: string;

    @IsNotEmpty({
        message: "userId không được để trống",
    })
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({
        message: "url không được để trống",
    })
    url: string;

    @IsNotEmpty({ message: 'status không được để trống', })
    status: string;

    @IsNotEmpty({ message: 'companyId không được để trống', })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'jobId không được để trống', })
    jobId: mongoose.Schema.Types.ObjectId;
}