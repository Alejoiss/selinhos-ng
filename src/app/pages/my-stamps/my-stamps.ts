import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NgxMaskPipe } from 'ngx-mask';

import { CompanyService } from '../../services/company/company.service';
import { CardComponent } from './card/card-component';

@Component({
    selector: 'app-my-stamps',
    imports: [CommonModule, NzButtonModule, NzIconModule, NzSkeletonModule, CardComponent, NzModalModule, NgxMaskPipe],
    templateUrl: './my-stamps.html',
    styleUrl: './my-stamps.scss'
})
export class MyStamps implements OnInit {
    companyId!: string;
    loading = false;
    data: any = null;
    modalVisible = false;

    modalCompany: any = null;
    @ViewChild('companyInfoTpl') companyInfoTpl!: TemplateRef<any>;

    constructor(
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private modal: NzModalService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.companyId = id;
                this.fetch();
            }
        });
    }

    fetch(): void {
        this.loading = true;
        this.companyService.getCompanyStamps(this.companyId).subscribe({
            next: (res) => {
                this.data = res;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    slotsFor(card: any): number[] {
        const total = card?.campaign_quantity_stamps || 0;
        return Array.from({ length: total }, (_, i) => i);
    }

    formatPhone(phone: any): string {
        if (!phone) return '—';
        const digits = String(phone).replace(/\D/g, '');
        if (digits.length === 11) {
            return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
        }
        if (digits.length === 10) {
            return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
        }
        return phone;
    }

    handleOk(): void {
        this.modalVisible = false;
    }
}
