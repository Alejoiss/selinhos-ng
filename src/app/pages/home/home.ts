import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';

import { AsideMenu } from '../../components/aside-menu/aside-menu';
import { Header } from '../../components/header/header';
import { UserCompany } from '../../models/user-company/user-company';
import { User } from '../../models/user/user';
import { CompanyService } from '../../services/company/company.service';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-home',
    imports: [
        NzModalModule,
        NzButtonModule,
        Header,
        AsideMenu,
        RouterModule,
        AsyncPipe
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home implements OnInit {
    user$!: Observable<User>;
    company: string | null = null;
    isVisible = false;

    constructor(
        private userService: UserService,
        private companyService: CompanyService
    ) { }

    ngOnInit() {
        this.user$ = this.userService.getLoggedUser();
        this.company = this.companyService.getStoredCompany();

        this.checkCompany();
    }

    checkCompany() {
        this.user$.subscribe(user => {
            if (!this.company) {
                if (user.user_usercompanies && user.user_usercompanies.length === 1) {
                    const companyId = user.user_usercompanies[0]?.company.id;
                    this.companyService.setStoredCompany(companyId);
                    this.userService.userCompany = user.user_usercompanies[0];
                    this.isVisible = false;
                    this.company = companyId;
                } else {
                    this.isVisible = true;
                }
            } else {
                this.userService.userCompany = user.user_usercompanies?.find(uc => uc.company.id === this.company!) || null;
            }
        });
    }

    selectCompany(userCompany: UserCompany) {
        this.companyService.setStoredCompany(userCompany.company.id);
        this.userService.userCompany = userCompany;
        this.isVisible = false;
        this.company = userCompany.company.id;
    }
}
