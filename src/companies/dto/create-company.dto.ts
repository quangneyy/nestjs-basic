import { IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty({
        message: "Email không được để trống",
    })
    name: string;

    @IsNotEmpty({
        message: "Password không được để trống",
    })
    address: string;

    @IsNotEmpty({
        message: "Password không được để trống",
    })
    description: string;
}
