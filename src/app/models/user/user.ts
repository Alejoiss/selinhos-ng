import { UserCompany } from '../user-company/user-company';

export class User {
    id!: string;
    password!: string;
    last_login!: string;
    is_superuser!: boolean;
    username!: string;
    first_name!: string;
    last_name!: string;
    is_staff!: boolean;
    is_active!: boolean;
    date_joined!: string;
    cpf!: string;
    birthday!: string;
    email!: string;
    cellphone!: string;
    user_permissions!: string[];

    //transient
    user_usercompanies: UserCompany[] = [];
}
