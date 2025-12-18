import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { State } from '../../models/state/state';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class StateService extends BaseService<State> {
    constructor(
        public override httpClient: HttpClient
    ) {
        super(httpClient, 'registers/state');
    }
}
