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

    getStoredCompany(): string | null {
        return window.localStorage.getItem('company');
    }

    setStoredCompany(companyId: string): void {
        window.localStorage.setItem('company', companyId);
    }

    addNewCompany(payload: any) {
        return this.httpClient.post<Company>(`${this.url}${this.endpoint}/add-new-company/`, payload);
    }
}
