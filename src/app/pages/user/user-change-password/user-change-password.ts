import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { userChangePasswordHeaderConfig } from '../../../components/internal-header/internal-header-configs';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'app-user-change-password',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzSpinModule,
        RouterModule,
        InternalHeader
    ],
    templateUrl: './user-change-password.html',
    styleUrl: './user-change-password.scss'
})
export class UserChangePassword implements OnInit {
    headerConfig = userChangePasswordHeaderConfig;
    form!: FormGroup;
    saving = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private notification: NzNotificationService
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            id: [null],
            current_password: ['', Validators.required],
            new_password: ['', [Validators.required, Validators.minLength(6)]],
            confirm_new_password: ['', Validators.required]
        }, { validators: this.passwordsMatchValidator });

        this.userService.getLoggedUser().subscribe({
            next: (user) => {
                if (user && user.id) {
                    this.form.patchValue({ id: user.id });
                }
            },
            error: () => {
                // ignore - form still usable but server will validate id
            }
        });
    }

    private passwordsMatchValidator(group: FormGroup) {
        const newPwd = group.get('new_password')?.value;
        const confirm = group.get('confirm_new_password')?.value;
        return newPwd && confirm && newPwd === confirm ? null : { passwordsMismatch: true };
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        this.saving = true;

        const payload = this.form.getRawValue();
        this.userService.changeUserPasswordByUser(payload).subscribe({
            next: () => {
                this.saving = false;
                this.notification.success('Sucesso', 'Senha alterada com sucesso.');
                this.form.reset();
            },
            error: (err: any) => {
                this.saving = false;
                if (err.status === 400 && err.error) {
                    this.notification.error('Erro', err.error);
                } else {
                    this.notification.error('Erro', 'Não foi possível alterar a senha.');
                }
            }
        });
    }
}
