import { City } from '../city/city';

export class Consumer {
    id!: string;
    cpf!: string;
    birthday?: Date;
    email?: string;
    cellphone!: string;
    created_at?: Date;
    updated_at?: Date;
    first_name?: string;
    last_name?: string;
    stamps?: number;
    handle!: string;
    selected_city!: City;
}
