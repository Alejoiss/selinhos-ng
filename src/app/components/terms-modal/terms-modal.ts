import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
    selector: 'app-terms-modal',
    standalone: true,
    imports: [CommonModule, NzButtonModule],
    templateUrl: './terms-modal.html',
    styleUrl: './terms-modal.scss'
})
export class TermsModal {
}
