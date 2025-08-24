import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserCompany } from '../../models/user-company/user-company';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class UserCompanyService extends BaseService<UserCompany> {
    constructor(
        public override httpClient: HttpClient
    ) {
        super(httpClient, 'registers/user-company');
    }
}
