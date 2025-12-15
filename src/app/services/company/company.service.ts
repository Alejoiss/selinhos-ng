import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Company } from '../../models/company/company';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyService extends BaseService<Company> {
    constructor(
        public override httpClient: HttpClient
    ) {
        super(httpClient, 'registers/company');
    }
}
