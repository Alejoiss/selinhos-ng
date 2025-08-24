import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AsideMenuUser } from '../../../components/aside-menu-user/aside-menu-user';
import { Header } from '../../../components/header/header';
import { User } from '../../../models/user/user';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'app-user-page',
    standalone: true,
    imports: [
        AsideMenuUser,
        RouterOutlet,
        Header
    ],
    templateUrl: './user-page.html',
    styleUrl: './user-page.scss'
})
export class UserPage implements OnInit, OnDestroy {
    user!: User;
    subscriptionBreak$ = new Subject<void>();

    constructor(
        private userService: UserService,
    ) { }

    ngOnInit() {
        this.userService.getLoggedUser()
        .pipe(takeUntil(this.subscriptionBreak$))
        .subscribe((user) => {
            this.user = user;
        });
    }

    ngOnDestroy() {
        this.subscriptionBreak$.next();
        this.subscriptionBreak$.complete();
    }
}
