import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Plan } from '../../models/plan/plan';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class PlanService extends BaseService<Plan> {

    constructor(
        public override httpClient: HttpClient
    ) {
        super(httpClient, 'registers/plan');
    }
}
