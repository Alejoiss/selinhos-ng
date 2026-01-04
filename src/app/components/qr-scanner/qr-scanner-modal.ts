import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LOAD_WASM, NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { Subscription } from 'rxjs';

import { StampQRService } from '../../services/stamp-qr/stamp-qr.service';

@Component({
    selector: 'app-qr-scanner-modal',
    standalone: true,
    imports: [CommonModule, NgxScannerQrcodeComponent, NzButtonModule, NzIconModule],
    templateUrl: './qr-scanner-modal.html',
    styleUrl: './qr-scanner-modal.scss'
})
export class QrScannerModalComponent implements AfterViewInit, OnDestroy {
    @ViewChild('scanner') scanner: any;

    scannedText: string | null = null;
    loading = false;
    redeemedStamps: any[] = [];
    errorMsg: string | null = null;

    private dataSub?: Subscription;

    constructor(
        private modalRef: NzModalRef,
        private cdr: ChangeDetectorRef,
        private stampQrService: StampQRService,
        private notification: NzNotificationService
    ) {}

    ngAfterViewInit(): void {
        // Ensure wasm load (assets configured in angular.json)
        try {
            LOAD_WASM('assets/wasm/ngx-scanner-qrcode.wasm').subscribe();
        } catch (e) {
            // ignore if LOAD_WASM not available at runtime
        }

        // Give the component a brief moment to initialize
        setTimeout(() => {
            try {
                this.scanner?.start();
                this.dataSub = this.scanner?.data?.subscribe((arr: any[]) => {
                    if (arr && arr.length > 0 && !this.scannedText) {
                        const first = arr[0];
                        const val = first?.value ?? first?.text ?? JSON.stringify(first);
                        this.scannedText = val;
                        try { this.scanner?.stop(); } catch (err) {}
                        this.cdr.detectChanges();
                        // Process token automatically
                        this.processToken(val);
                    }
                });
            } catch (err) {
                // ignore
            }
        }, 200);
    }

    confirm(): void {
        this.modalRef.close({ token: this.scannedText, redeemed: this.redeemedStamps || [] });
    }

    private processToken(token: string): void {
        if (!token) return;
        this.loading = true;
        this.redeemedStamps = [];
        this.errorMsg = null;

        this.stampQrService.redeemQrCode(token).subscribe({
            next: (res: any) => {
                // Expect an array of ConsumerStamp objects
                this.redeemedStamps = Array.isArray(res) ? res : (res?.results || []);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.loading = false;
                this.errorMsg = err?.error || 'Erro ao resgatar o QR Code.';
                try { this.notification.create('error', 'Erro', String(this.errorMsg)); } catch (e) {}
                this.cdr.detectChanges();
            }
        });
    }

    close(): void {
        try { this.scanner?.stop(); } catch (e) {}
        this.modalRef.close();
    }

    ngOnDestroy(): void {
        try { this.scanner?.stop(); } catch (e) {}
        this.dataSub?.unsubscribe();
    }
}
