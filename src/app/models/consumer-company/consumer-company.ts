import { Consumer } from '../consumer/consumer';
import { Company } from '../company/company';

export class ConsumerCompany {
    consumer!: Consumer;
    company!: Company;
    created_at?: Date;
    updated_at?: Date;
}
