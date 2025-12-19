import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { StampQR } from '../../models/stamp-qr/stamp-qr';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class StampQRService extends BaseService<StampQR> {

    constructor(
        public override httpClient: HttpClient
    ) {
        super(httpClient, 'stamps/stampqr');
    }

    redeemQrCode(token: string) {
        return this.httpClient.post(`${this.url}${this.endpoint}/redeem-qrcode/`, { token });
    }
}
