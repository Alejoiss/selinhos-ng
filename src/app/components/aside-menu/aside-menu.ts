import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { LayoutService } from '../../services/layout.service';
import { UserService } from '../../services/user/user.service';


@Component({
    selector: 'app-aside-menu',
    imports: [
        NzMenuModule,
        RouterModule,
    ],
    templateUrl: './aside-menu.html',
    styleUrl: './aside-menu.scss'
})
export class AsideMenu {
    isMobileMenuOpen = false;
    isMinimized = false;

    isMobileScreen = window.innerWidth < 768;

    selectedUrl = '';

    constructor(
        public userService: UserService,
        public layoutService: LayoutService,
        private router: Router
    ) {
        this.layoutService.mobileMenuOpen$.subscribe(open => {
            this.isMobileMenuOpen = open;
        });
        this.selectedUrl = this.router.url;
        this.router.events.subscribe(() => {
            this.selectedUrl = this.router.url;
        });
    }

    toggleMobileMenu() {
        this.layoutService.toggleMobileMenu();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (window.innerWidth >= 768 && this.isMobileMenuOpen) {
            this.isMobileMenuOpen = false;
        }

        this.isMobileScreen = window.innerWidth < 768;
    }
}
