import { Role } from "src/enums/roles.enum";
export type CreateUserDto = {
    userId?: number;
    username: string;
    password: string;
    roles: Role[];
};