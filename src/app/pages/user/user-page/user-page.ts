import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AsideMenuUser } from '../../../components/aside-menu-user/aside-menu-user';
import { Header } from '../../../components/header/header';
import { Consumer } from '../../../models/consumer/consumer';
import { ConsumerService } from '../../../services/consumer/consumer.service';

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
    consumer!: Consumer;
    subscriptionBreak$ = new Subject<void>();

    constructor(
        private consumerService: ConsumerService,
    ) { }

    ngOnInit() {
        this.consumerService.getLoggedUser()
        .pipe(takeUntil(this.subscriptionBreak$))
        .subscribe((user) => {
            this.consumer = user;
        });
    }

    ngOnDestroy() {
        this.subscriptionBreak$.next();
        this.subscriptionBreak$.complete();
    }
}
