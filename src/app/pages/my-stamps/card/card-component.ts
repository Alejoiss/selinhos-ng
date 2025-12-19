import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { CardService } from '../../../services/card/card.service';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule, NzButtonModule, NzModalModule],
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

    constructor(
        private modal: NzModalService,
        private cardService: CardService,
        private notification: NzNotificationService
    ) {}

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

    confirmRequest(): void {
        // Show confirm modal with campaign prize
        const prize = this.card?.campaign_prize || 'o prêmio';
        this.modal.confirm({
            nzTitle: `Deseja trocar este cartão?`,
            nzContent: `Você irá resgatar: <strong>${prize}</strong>`,
            nzOkText: 'Sim, trocar',
            nzOkType: 'primary',
            nzOnOk: () => this.requestCard()
        });
    }

    private requestCard(): void {
        if (!this.card?.id) return;
        this.cardService.requestCard(this.card.id).subscribe({
            next: (res: any) => {
                // res expected to contain requested_at
                this.card.requested = true;
                this.card.requested_at = res?.requested_at || new Date().toISOString();
                this.notification.create('success', 'Solicitação enviada', 'Seu resgate foi solicitado com sucesso.');
            },
            error: (err: any) => {
                if (err?.status === 400) {
                    const msg = err.error || 'Erro ao solicitar resgate.';
                    this.notification.create('error', 'Erro', msg);
                } else {
                    this.notification.create('error', 'Erro', 'Ocorreu um erro ao solicitar o resgate. Tente novamente mais tarde.');
                }
            }
        });
    }
}
