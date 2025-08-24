import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Profile } from '../../models/profile/profile';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileService extends BaseService<Profile> {

    constructor(
        public override httpClient: HttpClient
    ) {
        super(httpClient, 'registers/profile');
    }

    getLimit(): Observable<{ used: number; limit: number }> {
        return this.httpClient.get<{ used: number; limit: number }>(`${this.url}${this.endpoint}/get-limit/`);
    }
}
