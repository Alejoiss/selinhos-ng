import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Header } from '../../../components/header/header';
import { Consumer } from '../../../models/consumer/consumer';
import { ConsumerService } from '../../../services/consumer/consumer.service';

@Component({
    selector: 'app-user-page',
    standalone: true,
    imports: [
        RouterOutlet,
        Header
    ],
    templateUrl: './user-page.html',
    styleUrl: './user-page.scss',
    animations: [
        trigger('fadeAnimation', [
            transition('* <=> *', [
                query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
                group([
                    query(':enter', [style({ opacity: 0 }), animate('200ms ease-out', style({ opacity: 1 }))], { optional: true }),
                    query(':leave', [style({ opacity: 1 }), animate('200ms ease-out', style({ opacity: 0 }))], { optional: true })
                ])
            ])
        ])
    ]
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
            if (user) {
                this.consumer = user;
            }
        });
    }

    ngOnDestroy() {
        this.subscriptionBreak$.next();
        this.subscriptionBreak$.complete();
    }

    getRouteAnimationState(outlet: RouterOutlet) {
        if (!outlet || !outlet.isActivated) return '';
        const dataState = outlet.activatedRoute?.snapshot?.data?.['animation'];
        if (dataState) return dataState;
        return outlet.activatedRoute?.snapshot?.url.map(u => u.toString()).join('/');
    }
}
