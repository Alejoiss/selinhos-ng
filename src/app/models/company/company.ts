export class Company {
    id!: string;
    name!: string;
    legal_name!: string;
    cnpj!: string;
    plan!: string;
    zip_code!: string;
    street!: string;
    number!: string;
    complement!: string;
    neighborhood!: string;
    state!: string;
    city!: string;
    logo?: string;

    // transient
    total_stamps?: number;
}
