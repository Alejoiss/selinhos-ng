import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Company } from '../../models/company/company';
import { User } from '../../models/user/user';
import { CompanyService } from '../../services/company/company.service';
import { LayoutService } from '../../services/layout.service';

@Component({
    selector: 'app-header',
    imports: [
        RouterModule
    ],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class Header implements OnInit{
    @Input() user!: User;

    company!: Company;
    showDropdown = false;
    showSubmenu = false;

    constructor(
        private companyService: CompanyService,
        public layoutService: LayoutService,
        private router: Router
    ) { }
    goToUserArea(): void {
        this.showDropdown = false;
        this.router.navigate(['/user/dados']);
    }

    ngOnInit(): void {
        const companyId = this.companyService.getStoredCompany();
        if (companyId) {
            this.company = this.user.user_usercompanies?.find(uc => uc.company.id === companyId)?.company!;
        }
    }

    changeCompany(company: Company): void {
        this.companyService.setStoredCompany(company.id);
        window.location.reload();
    }

    logout(): void {
        this.showDropdown = false;
        setTimeout(() => {
            window.location.href = '/login';
        }, 100);
    }
}
