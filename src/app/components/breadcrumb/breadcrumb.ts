import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
    label: string;
    url?: string;
}

@Component({
    selector: 'app-breadcrumb',
    imports: [
        RouterModule
    ],
    templateUrl: './breadcrumb.html',
    styleUrl: './breadcrumb.scss'
})
export class Breadcrumb {
    @Input() items: BreadcrumbItem[] = [];
}
