export class Campaign {
    id!: string;
    company!: string;
    name!: string;
    active!: boolean;
    is_main_campaign!: boolean;
    description?: string;
    price_by_stamp!: number;
    quantity_stamps!: number;
    prize?: string;
}
