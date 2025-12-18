import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [NzButtonModule],
    templateUrl: './card-component.html',
    styleUrl: './card-component.scss'
})
export class CardComponent implements OnChanges {
    @Input() card: any;

    // Derived properties for template usage
    slots: number[] = [];
    filledSlots: Array<any | null> = [];
    percentVal = 0;
    statusMsg = '';
    isComplete = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['card']) {
            this.recompute();
        }
    }

    private recompute(): void {
        const total = this.card?.campaign_quantity_stamps || 0;
        this.slots = Array.from({ length: total }, (_, i) => i);
        this.filledSlots = this.slots.map(i => (this.card?.stamps && this.card.stamps[i] ? this.card.stamps[i] : null));
        const got = (this.card?.stamps || []).length;
        this.percentVal = total === 0 ? 0 : Math.round((got / total) * 100);
        this.isComplete = total > 0 && got >= total;
        this.statusMsg = this.computeStatusMessage(this.percentVal);
    }

    private computeStatusMessage(p: number): string {
        if (p === 100) return 'Parabéns! Você completou.';
        if (p >= 80) return 'Falta pouco para o resgate!';
        if (p >= 40) return 'Continue assim, está indo muito bem!';
        return 'Você começou uma nova coleção!';
    }
}
