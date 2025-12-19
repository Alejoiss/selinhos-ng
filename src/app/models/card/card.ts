export class Card {
    id!: string;
    total_stamps?: number;
    stamps?: Array<{ id: number; name: string; image?: string }>;
    campaign_name?: string;
    campaign_quantity_stamps?: number;
    campaign_prize?: string;
    requested?: boolean;
    requested_at?: string; // ISO date string
}
