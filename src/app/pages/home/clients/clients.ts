import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { consumersHeaderConfig } from '../../../components/internal-header/internal-header-configs';
import { Consumer } from '../../../models/consumer/consumer';
import { CellphonePrivacyMaskPipe } from '../../../pipes/cellphone-privacy-mask/cellphone-privacy-mask.pipe';
import { CpfPrivacyMaskPipe } from '../../../pipes/cpf-privacy-mask/cpf-privacy-mask.pipe';
import { ConsumerService } from '../../../services/consumer/consumer.service';

@Component({
    selector: 'app-clients',
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        InternalHeader,
        NzDropDownModule,
        NzTableModule,
        NzButtonModule,
        CpfPrivacyMaskPipe,
        CellphonePrivacyMaskPipe
    ],
    templateUrl: './clients.html',
    styleUrl: './clients.scss'
})
export class Clients {
    headerConfig = consumersHeaderConfig;
    listOfConsumers: Consumer[] = [];
    loading = false;
    total = 0;
    pageSize = 10;
    pageIndex = 1;

    // Filtros
    cpfFilterVisible = false;
    cpfFilterValue = '';
    nameFilterVisible = false;
    nameFilterValue = '';
    cellphoneFilterVisible = false;
    cellphoneFilterValue = '';
    emailFilterVisible = false;
    emailFilterValue = '';

    constructor(private consumerService: ConsumerService) { }

    ngOnInit(): void {
        this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, [], this.cpfFilterValue, this.nameFilterValue, this.cellphoneFilterValue, this.emailFilterValue);
    }

    loadDataFromServer(
        pageIndex: number,
        pageSize: number,
        sortField: string | null,
        sortOrder: string | null,
        filter: Array<{ key: string; value: string[] }>,
        cpf?: string | null,
        name?: string | null,
        cellphone?: string | null,
        email?: string | null
    ): void {
        let params = new HttpParams()
            .set('page', `${pageIndex}`)
            .set('results', `${pageSize}`);
        if (sortField) params = params.set('sortField', sortField);
        if (sortOrder) params = params.set('sortOrder', sortOrder);
        if (cpf) params = params.set('cpf', cpf);
        if (name) params = params.set('name', name);
        if (cellphone) params = params.set('cellphone', cellphone);
        if (email) params = params.set('email', email);

        this.loading = true;
        this.consumerService.list(params).subscribe({
            next: (data: any) => {
                this.loading = false;
                this.listOfConsumers = data.results || data;
                this.total = data.count || data.length;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onQueryParamsChange(params: any): void {
        const { pageSize, pageIndex, sort, filter } = params;
        const currentSort = sort?.find((item: any) => item.value !== null);
        const sortField = (currentSort && currentSort.key) || null;
        const sortOrder = (currentSort && currentSort.value) || null;

        this.loadDataFromServer(
            pageIndex,
            pageSize,
            sortField,
            sortOrder,
            filter || [],
            this.cpfFilterValue || null,
            this.nameFilterValue || null,
            this.cellphoneFilterValue || null,
            this.emailFilterValue || null
        );
    }

    searchCPF(): void {
        this.cpfFilterVisible = false;
        this.onQueryParamsChange({
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            sort: [],
            filter: []
        });
    }

    resetCPF(): void {
        this.cpfFilterValue = '';
        this.searchCPF();
    }

    searchName(): void {
        this.nameFilterVisible = false;
        this.onQueryParamsChange({
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            sort: [],
            filter: []
        });
    }

    resetName(): void {
        this.nameFilterValue = '';
        this.searchName();
    }

    searchCellphone(): void {
        this.cellphoneFilterVisible = false;
        this.onQueryParamsChange({
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            sort: [],
            filter: []
        });
    }

    resetCellphone(): void {
        this.cellphoneFilterValue = '';
        this.searchCellphone();
    }

    searchEmail(): void {
        this.emailFilterVisible = false;
        this.onQueryParamsChange({
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            sort: [],
            filter: []
        });
    }

    resetEmail(): void {
        this.emailFilterValue = '';
        this.searchEmail();
    }
}
