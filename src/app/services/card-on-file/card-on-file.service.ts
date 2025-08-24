import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CardOnFile } from '../../models/card-on-file/card-on-file';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class CardOnFileService extends BaseService<CardOnFile> {

    constructor(
        protected http: HttpClient
    ) {
        super(http, 'registers/cardonfile');
    }
}
