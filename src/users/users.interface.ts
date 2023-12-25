export interface IUser {
    _id: string;
    name: string;
    email: string;
    balance: number;
    role: {
        _id: string;
        name: string;
    };
    permissions?: {
        _id: string;
        name: string;
        apiPath: string;
        module: string;
    }[]
    age?: number;
        gender?: string;
        address?: string;
        company?: {
            _id: string;
            name: string;
        }
}