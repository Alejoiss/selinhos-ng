import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Campaign } from '../../../models/campaign/campaign';
import { BaseService } from '../../base.service';

@Injectable({
    providedIn: 'root'
})
export class CampaignService extends BaseService<Campaign> {
    constructor(
        public override httpClient: HttpClient
    ) {
        super(httpClient, 'registers/campaign');
    }

    getLimit(): Observable<{ used: number; limit: number }> {
        return this.httpClient.get<{ used: number; limit: number }>(`${this.url}${this.endpoint}/get-limit/`);
    }
}
