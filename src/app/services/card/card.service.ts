import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Card } from '../../models/card/card';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class CardService extends BaseService<Card> {
    constructor(public override httpClient: HttpClient) {
        super(httpClient, 'stamps/card');
    }

    requestCard(id: string) {
        return this.httpClient.post(`${this.url}${this.endpoint}/${id}/request-card/`, {});
    }
}
