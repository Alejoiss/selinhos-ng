import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SeoService } from './services/seo/seo.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
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
export class App {
    constructor(private seo: SeoService) { }

    getRouteAnimationState(outlet: RouterOutlet) {
        return outlet && outlet.isActivated ? outlet.activatedRoute?.snapshot?.url.map(u => u.toString()).join('/') : '';
    }
}
