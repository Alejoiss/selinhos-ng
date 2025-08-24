import { Component, Input } from '@angular/core';

import { Breadcrumb, BreadcrumbItem } from '../breadcrumb/breadcrumb';


export interface InternalHeaderConfig {
    title: string;
    description: string;
    breadcrumbItems?: BreadcrumbItem[];
    icon?: string;
}

@Component({
    selector: 'app-internal-header',
    imports: [
        Breadcrumb
    ],
    templateUrl: './internal-header.html',
    styleUrl: './internal-header.scss'
})
export class InternalHeader {
    @Input({ required: true }) config!: InternalHeaderConfig;
}
