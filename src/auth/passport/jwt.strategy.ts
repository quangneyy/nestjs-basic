import { IUser } from './../../users/users.interface';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
    ) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN"),
        });
    }

    async validate(payload: IUser) {
        const { _id, name, email, role } = payload;
        //req.user
        return {
            _id,
            name,
            email,
            role,
        };
    }
}