import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './../users/dto/create-user.dto';
import { IUser } from './../users/users.interface';
import { UsersService } from './../users/users.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { Response } from 'express';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private rolesService: RolesService
    ) { }

    //username/ pass là 2 tham số thư viện passport nó ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                const userRole = user.role as unknown as { _id: string, name: string }
                const temp = await this.rolesService.findOne(userRole._id);

                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }

                return objUser;
            }
        }

        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions, balance, age, gender, address, company } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role,
            balance,
            age,
            gender,
            address,
            company
        };
        const refresh_token = this.createRefreshToken(payload);

        // update user with refresh token
        await this.usersService.updatedUserToken(refresh_token, _id);

        // set refresh_token as cookies
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions,
                balance
            },
        };
    }

    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);

        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        };
    }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000
        });
        return refresh_token;
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })

            let user = await this.usersService.findUserByToken(refreshToken);
            if (user) {
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role,
                }

                const refresh_token = this.createRefreshToken(payload);

                // update user with refresh token 
                await this.usersService.updatedUserToken(refreshToken, _id.toString());

                // fetch user's role 
                const userRole = user.role as unknown as { _id: string, name: string }
                const temp = await this.rolesService.findOne(userRole._id)

                // set refresh_token as cookies
                response.clearCookie("refresh_token");

                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
                })

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: temp?.permissions ?? []
                    }
                };
            } else {
                throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`);
            }
        } catch (error) {
            throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`)
        }
    }

    logout = async (response: Response, user: IUser) => {
        await this.usersService.updatedUserToken("", user._id);
        response.clearCookie("refresh_token");
        return "ok";
    }
}