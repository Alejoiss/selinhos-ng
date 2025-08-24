import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ManualStampRegister } from '../../models/manual-stamp-register/manual-stamp-register';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class ManualStampRegisterServiceService extends BaseService<ManualStampRegister> {

    constructor(
        public override httpClient: HttpClient
    ) {
        super(httpClient, 'stamps/manualstampregister');
    }
}
