import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { profilesHeaderConfig } from '../../../components/internal-header/internal-header-configs';
import { Profile } from '../../../models/profile/profile';
import { ProfileService } from '../../../services/profile/profile.service';

@Component({
    selector: 'app-profiles',
    imports: [
        InternalHeader,
        NzTableModule,
        NzButtonModule,
        NzTagModule,
        NzDropDownModule,
        RouterModule,
        FormsModule
    ],
    templateUrl: './profiles.html',
    styleUrl: './profiles.scss'
})
export class Profiles {
    headerConfig = profilesHeaderConfig;
    selectedProfile: string | null = null;

    limitUsed: number | null = null;
    limitLimit: number | null = null;
    limitReached = true;

    total = 1;
    listOfProfiles: Profile[] = [];
    loading = true;
    pageSize = 10;
    pageIndex = 1;
    filterStatus = [
        { text: 'Ativo', value: true },
        { text: 'Inativo', value: false }
    ];
    searchValue = '';
    visible = false;

    constructor(
        private profileService: ProfileService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
        this.profileService.getLimit().subscribe({
            next: (res) => {
                this.limitUsed = res.used;
                this.limitLimit = res.limit;
                this.limitReached = (this.limitLimit !== null && this.limitUsed >= this.limitLimit);
                this.headerConfig = {
                    ...profilesHeaderConfig,
                    description: `${profilesHeaderConfig.description} Seu plano permite até ${this.limitLimit} perfis.`
                };
            }
        });
    }

    loadDataFromServer(
        pageIndex: number,
        pageSize: number,
        sortField: string | null,
        sortOrder: string | null,
        filter: Array<{ key: string; value: string[] }>,
        active?: (boolean | string)[] | null,
        name?: string | null
    ): void {
        let params = new HttpParams()
            .append('page', `${pageIndex}`)
            .append('results', `${pageSize}`)
            .append('sortField', `${sortField}`)
            .append('sortOrder', `${sortOrder}`);

        if (active && active.length) {
            active.forEach(val => {
                params = params.append('active', `${val}`);
            });
        }
        if (name) {
            params = params.append('name', name);
        }

        this.loading = true;
        this.profileService.listWithPagination(params).subscribe({
            next: (data) => {
                this.loading = false;
                this.listOfProfiles = data.results;
                this.total = data.count;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex, sort, filter } = params;
        const currentSort = sort.find(item => item.value !== null);
        const sortField = (currentSort && currentSort.key) || null;
        const sortOrder = (currentSort && currentSort.value) || null;

        // Extrair filtro de active (pode ser múltiplo)
        const activeFilter = filter.find(f => f.key === 'active');
        let active: (boolean | string)[] | null = null;
        if (activeFilter && activeFilter.value.length) {
            active = activeFilter.value;
        }

        const name = this.searchValue || null;

        this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter, active, name);
    }

    editProfile(data: Profile): void {
        this.router.navigate(['/home/perfis/editar', data.id]);
    }

    reset(): void {
        this.searchValue = '';
        this.search();
    }

    search(): void {
        const filter: Array<{ key: string; value: string[] }> = [
            { key: 'active', value: [] }
        ];
        this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, filter, null, this.searchValue);
    }
}
