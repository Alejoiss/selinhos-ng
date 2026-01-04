import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxMaskDirective } from 'ngx-mask';

import { Consumer } from '../../../models/consumer/consumer';
import { ConsumerService } from '../../../services/consumer/consumer.service';

@Component({
    selector: 'app-user-data',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzSpinModule,
        NgxMaskDirective,
    ],
    templateUrl: './user-data.html',
    styleUrl: './user-data.scss'
})
export class UserData implements OnInit {
    form!: FormGroup;
    loading = true;
    saving = false;

    constructor(
        private fb: FormBuilder,
        private consumerService: ConsumerService,
        private notification: NzNotificationService
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            id: [null],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            cellphone: ['', Validators.required]
        });

        this.consumerService.getLoggedUser().subscribe({
            next: (user: Consumer | null) => {
                if (user && user.id) {
                    this.form.patchValue({
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        cellphone: user.cellphone
                    });
                }
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        this.saving = true;
        const payload = { ...this.form.getRawValue() };
        const id = payload.id;
        // Remove id from body as update endpoint uses id in URL
        delete payload.id;
        this.consumerService.update(payload as any, id).subscribe({
            next: () => {
                this.saving = false;
                // refresh the cached consumer so other components (like consumer-button) reflect changes
                this.consumerService.refreshLoggedUser().subscribe({
                    next: () => {
                        this.notification.success('Sucesso', 'Dados atualizados com sucesso.');
                    },
                    error: () => {
                        this.notification.success('Sucesso', 'Dados atualizados com sucesso.');
                    }
                });
            },
            error: (err: any) => {
                this.saving = false;
                this.notification.error('Erro', 'Não foi possível atualizar os dados.');
            }
        });
    }
}
