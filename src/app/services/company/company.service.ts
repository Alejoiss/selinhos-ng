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

    /**
     * Retorna os selos do usuário para a empresa identificada por `id`.
     */
    getCompanyStamps(id: string) {
        return this.httpClient.get<any>(`${this.url}${this.endpoint}/${id}/get-company-stamps/`);
    }
}
