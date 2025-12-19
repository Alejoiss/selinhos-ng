import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Observable } from 'rxjs';

import { QrScannerModalComponent } from '../../components/qr-scanner/qr-scanner-modal';
import { Company } from '../../models/company/company';
import { Consumer } from '../../models/consumer/consumer';
import { CompanyService } from '../../services/company/company.service';
import { ConsumerService } from '../../services/consumer/consumer.service';

@Component({
    selector: 'app-home',
    imports: [
        NzModalModule,
        NzButtonModule,
        NzInputModule,
        NzIconModule,
        NzSelectModule,
        RouterModule,
        FormsModule,
        AsyncPipe
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home implements OnInit {
    consumer$!: Observable<Consumer>;
    companies: Company[] = [];
    stampsCompanies: Company[] = [];
    otherCompanies: Company[] = [];
    searchTerm = '';
    loading = false;

    lastScanned: string | null = null;

    constructor(
        private consumerService: ConsumerService,
        private companyService: CompanyService,
        private notification: NzNotificationService,
        private router: Router,
        private modal: NzModalService
    ) { }

    ngOnInit() {
        this.consumer$ = this.consumerService.getLoggedUser();
        this.fetchCompanies();
    }

    fetchCompanies(): void {
        this.loading = true;
        this.companyService.list().subscribe({
            next: (companies) => {
                this.companies = companies || [];
                this.applyFilter();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.notification.create('error', 'Erro ao carregar empresas', 'Não foi possível carregar a lista de empresas. Tente novamente mais tarde.');
            }
        });
    }

    applyFilter(): void {
        const term = this.searchTerm.trim().toLowerCase();
        const filtered = term ? this.companies.filter(c => c.name.toLowerCase().includes(term)) : this.companies.slice();
        this.stampsCompanies = filtered.filter(c => (c.total_stamps || 0) > 0);
        this.otherCompanies = filtered.filter(c => (c.total_stamps || 0) <= 0);
    }

    openCompany(id: string): void {
        this.router.navigate(['/meus-selos', id]);
    }

    openQrScanner(): void {
        const ref = this.modal.create({
            nzTitle: 'Adicionar selo',
            nzContent: QrScannerModalComponent,
            nzFooter: null
        });

        ref.afterClose.subscribe((result) => {
            if (result) {
                if (typeof result === 'object' && result.redeemed && result.redeemed.length > 0) {
                    // Refresh company counts to reflect new stamps
                    this.fetchCompanies();
                    this.notification.create('success', 'Selos resgatados', `${result.redeemed.length} selo(s) resgatados`);
                } else {
                    const token = (typeof result === 'object') ? (result.token ?? null) : result;
                    if (token) {
                        this.lastScanned = token;
                        this.notification.create('success', 'QR Code lido', String(token));
                    }
                }
            }
        });
    }
}
