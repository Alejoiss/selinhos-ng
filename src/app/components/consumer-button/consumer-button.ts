import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Consumer } from '../../models/consumer/consumer';

@Component({
    selector: 'app-consumer-button',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './consumer-button.html',
    styleUrl: './consumer-button.scss'
})
export class ConsumerButton {
    @Input() consumer?: Consumer | null;

    showUserMenu = false;

    constructor(private router: Router) { }

    goTo(route: string): void {
        this.showUserMenu = false;
        this.router.navigate([route]);
    }

    logout(): void {
        this.showUserMenu = false;
        setTimeout(() => {
            window.location.href = '/login';
        }, 100);
    }
}
