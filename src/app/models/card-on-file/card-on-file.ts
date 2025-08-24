export enum CardOnFileStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    EXPIRED = 'expired'
}

export class CardOnFile {
    static CardOnFileStatusLabels: { [key in CardOnFileStatus]: string } = {
        [CardOnFileStatus.ACTIVE]: 'Ativo',
        [CardOnFileStatus.INACTIVE]: 'Inativo',
        [CardOnFileStatus.EXPIRED]: 'Expirado'
    };

    id!: string;
    name!: string;
    brand!: string;
    last4!: string;
    exp_month!: number;
    exp_year!: number;
    is_default!: boolean;
    status!: CardOnFileStatus;
}
