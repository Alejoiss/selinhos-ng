import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';

import { AsideMenu } from '../../components/aside-menu/aside-menu';
import { Header } from '../../components/header/header';
import { Consumer } from '../../models/consumer/consumer';
import { ConsumerService } from '../../services/consumer/consumer.service';

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
    consumer$!: Observable<Consumer>;
    company: string | null = null;
    isVisible = false;

    constructor(
        private consumerService: ConsumerService
    ) { }

    ngOnInit() {
        this.consumer$ = this.consumerService.getLoggedUser();

        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
        }, (error) => {
            console.log(error);
        });
    }
}
