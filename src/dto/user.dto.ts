import { RoleEntity } from "src/entity/role.entity";
export type CreateUserDto = {
    id?: number;
    email: string;
    password: string;
    roles: RoleEntity[];
};