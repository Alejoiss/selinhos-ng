import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { City } from '../../models/city/city';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class CityService extends BaseService<City> {
    constructor(
        public override httpClient: HttpClient
    ) {
        super(httpClient, 'registers/city');
    }

    /**
     * Retorna as cidades ativas (distintas) que possuem vínculo com Company.
     */
    getActiveCities() {
        return this.httpClient.get<City[]>(`${this.url}${this.endpoint}/get-active-cities/`);
    }
}
