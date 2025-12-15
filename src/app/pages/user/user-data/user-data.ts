import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxMaskDirective } from 'ngx-mask';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { userDataHeaderConfig } from '../../../components/internal-header/internal-header-configs';
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
        InternalHeader
    ],
    templateUrl: './user-data.html',
    styleUrl: './user-data.scss'
})
export class UserData implements OnInit {
    headerConfig = userDataHeaderConfig;
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
            next: (user) => {
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
                this.notification.success('Sucesso', 'Dados atualizados com sucesso.');
            },
            error: (err: any) => {
                this.saving = false;
                this.notification.error('Erro', 'Não foi possível atualizar os dados.');
            }
        });
    }
}
