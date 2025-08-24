import { Company } from '../company/company';
import { Profile } from '../profile/profile';

export class UserCompany {
    id!: string;
    user!: string;
    company!: Company;
    profile!: Profile;
    active!: boolean;
    is_owner!: boolean;
    invite_accepted!: boolean;
}
