import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { Consumer } from '../../models/consumer/consumer';
import { ConsumerService } from '../../services/consumer/consumer.service';
import { ConsumerButton } from '../consumer-button/consumer-button';

@Component({
    selector: 'app-header',
    imports: [
        RouterModule,
        ConsumerButton,
        AsyncPipe
    ],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class Header implements OnInit {
    consumer$!: Observable<Consumer | null>;

    constructor(
        private consumerService: ConsumerService,
    ) { }

    ngOnInit() {
        this.consumer$ = this.consumerService.getLoggedUser();
    }
}
