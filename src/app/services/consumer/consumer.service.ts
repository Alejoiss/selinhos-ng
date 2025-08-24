import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Consumer } from '../../models/consumer/consumer';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class ConsumerService extends BaseService<Consumer> {

    constructor(
        http: HttpClient
    ) {
        super(http, 'registers/consumer');
    }
}
