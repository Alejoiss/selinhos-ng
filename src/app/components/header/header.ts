import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Company } from '../../models/company/company';
import { Consumer } from '../../models/consumer/consumer';
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
    @Input() consumer!: Consumer;

    company!: Company;
    showDropdown = false;
    showSubmenu = false;

    constructor(
        public layoutService: LayoutService,
        private router: Router
    ) { }
    goToUserArea(): void {
        this.showDropdown = false;
        this.router.navigate(['/user/dados']);
    }

    ngOnInit(): void {
    }

    logout(): void {
        this.showDropdown = false;
        setTimeout(() => {
            window.location.href = '/login';
        }, 100);
    }
}
