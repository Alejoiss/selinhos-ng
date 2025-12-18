import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { CompanyService } from '../../services/company/company.service';
import { CardComponent } from './card/card-component';

@Component({
    selector: 'app-my-stamps',
    imports: [CommonModule, NzButtonModule, NzIconModule, NzSkeletonModule, CardComponent],
    templateUrl: './my-stamps.html',
    styleUrl: './my-stamps.scss'
})
export class MyStamps implements OnInit {
    companyId!: string;
    loading = false;
    data: any = null;

    constructor(
        private route: ActivatedRoute,
        private companyService: CompanyService
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
}
