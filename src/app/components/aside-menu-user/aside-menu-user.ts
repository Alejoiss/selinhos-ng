import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Subject, takeUntil } from 'rxjs';

import { LayoutService } from '../../services/layout.service';

@Component({
    selector: 'app-aside-menu-user',
    standalone: true,
    imports: [NzMenuModule, RouterModule],
    templateUrl: './aside-menu-user.html',
    styleUrl: './aside-menu-user.scss'
})
export class AsideMenuUser implements OnDestroy {
    isMobileMenuOpen = false;
    isMobileScreen = window.innerWidth < 768;
    selectedUrl = '';
    subscriptionBreak$ = new Subject<void>();

    constructor(
        public layoutService: LayoutService,
        private router: Router
    ) {
        this.layoutService.mobileMenuOpen$
        .pipe(takeUntil(this.subscriptionBreak$))
        .subscribe(open => {
            this.isMobileMenuOpen = open;
        });
        this.selectedUrl = this.router.url;
        this.router.events
        .pipe(takeUntil(this.subscriptionBreak$))
        .subscribe(() => {
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

    ngOnDestroy() {
        this.subscriptionBreak$.next();
        this.subscriptionBreak$.complete();
    }
}
