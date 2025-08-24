import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NgxMaskPipe } from 'ngx-mask';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { usersHeaderConfig } from '../../../components/internal-header/internal-header-configs';
import { User } from '../../../models/user/user';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'app-users',
    imports: [
        InternalHeader,
        NzTableModule,
        NzButtonModule,
        NzTagModule,
        NzDropDownModule,
        RouterModule,
        FormsModule,
        NgxMaskPipe
    ],
    templateUrl: './users.html',
    styleUrl: './users.scss'
})
export class Users {
    headerConfig = usersHeaderConfig;

    limitUsed: number | null = null;
    limitLimit: number | null = null;
    limitReached = true;

    total = 1;
    listOfUsers: User[] = [];
    loading = true;
    pageSize = 10;
    pageIndex = 1;
    filterStatus = [
        { text: 'Ativo', value: true },
        { text: 'Inativo', value: false }
    ];
    cpfSearchValue = '';
    cpfVisible = false;
    nameSearchValue = '';
    nameVisible = false;

    constructor(
        public userService: UserService,
        private router: Router,
        private notification: NzNotificationService,
    ) { }

    ngOnInit(): void {
        // initial load
        this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
        this.userService.getLimit().subscribe({
            next: (res) => {
                this.limitUsed = res.used;
                this.limitLimit = res.limit;
                this.limitReached = (this.limitLimit !== null && this.limitUsed >= this.limitLimit);
                // update header description to show plan limit
                this.headerConfig = {
                    ...usersHeaderConfig,
                    description: `${usersHeaderConfig.description} Seu plano permite o cadastro de até ${this.limitLimit} usuários.`
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
        cpf?: string | null,
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
        if (cpf) {
            params = params.append('cpf', cpf);
        }
        if (name) {
            params = params.append('name', name);
        }

        this.loading = true;
        this.userService.getAllUsers(params).subscribe({
            next: (data: any) => {
                this.loading = false;
                this.listOfUsers = data.results;
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

        const cpf = this.cpfSearchValue || null;
        const name = this.nameSearchValue || null;

        this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter, active, cpf, name);
    }

    searchCpf(): void {
        this.cpfVisible = false;
        this.onQueryParamsChange({
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            sort: [],
            filter: []
        } as NzTableQueryParams);
    }

    resetCpf(): void {
        this.cpfSearchValue = '';
        this.searchCpf();
    }

    searchName(): void {
        this.nameVisible = false;
        this.onQueryParamsChange({
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            sort: [],
            filter: []
        } as NzTableQueryParams);
    }

    resetName(): void {
        this.nameSearchValue = '';
        this.searchName();
    }

    editUser(user: User): void {
        this.router.navigate(['/home/usuarios/editar', user.id]);
    }

    toggleActiveUser(user: User): void {
        const newStatus = !user.is_active;
        this.userService.setActiveStatus(user.id, newStatus).subscribe({
            next: () => {
                user.is_active = newStatus;
            },
            error: (err) => {
                this.notification.error('Erro', 'Erro ao alterar status do usuário');
            }
        });
    }

    cancelInvite(user: User) {
        this.userService.cancelUserInvitation(user.id).subscribe({
            next: () => {
                this.listOfUsers = this.listOfUsers.filter(u => u.id !== user.id);
                this.notification.success('Convite cancelado', `Convite para ${user.email} foi cancelado com sucesso.`);
            },
            error: () => {
                this.notification.error('Erro', 'Não foi possível cancelar o convite.');
            }
        });
    }
}
