import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxMaskDirective } from 'ngx-mask';

import { UserService } from '../../services/user/user.service';
import { CustomValidators } from '../../utils/validators';

@Component({
    selector: 'app-accept-invitation',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NzButtonModule,
        NzInputModule,
        NzSpinModule,
        RouterModule,
        NgxMaskDirective
    ],
    templateUrl: './accept-invitation.html',
    styleUrl: './accept-invitation.scss'
})
export class AcceptInvitation implements OnInit {
    form!: FormGroup;
    token!: string;
    loading = true;
    isNewUser = false;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private notification: NzNotificationService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token') || '';
        if (!this.token) {
            this.notification.error('Erro', 'Token de convite não informado.');
            this.router.navigate(['/login']);
            return;
        }
        this.userService.validateUserInvitation(this.token).subscribe({
            next: (resp: any) => {
                this.isNewUser = resp.new_user;
                this.loading = false;
                if (!this.isNewUser) {
                    this.notification.success('Sucesso', 'Usuário ativado com sucesso!');
                    this.router.navigate(['/login']);
                } else {
                    this.form = this.fb.group({
                        cpf: ['', [Validators.required, CustomValidators.cpfValidator()]],
                        first_name: ['', [Validators.required]],
                        last_name: ['', [Validators.required]],
                        cellphone: ['', [Validators.required]],
                        password: ['', [Validators.required, Validators.minLength(6)]]
                    });
                }
            },
            error: () => {
                this.loading = false;
                this.notification.error('Erro', 'Não foi possível validar o convite.');
                this.router.navigate(['/login']);
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        const payload = { ...this.form.value, token: this.token };
        this.loading = true;
        this.userService.useUserInvitation(payload).subscribe({
            next: () => {
                this.loading = false;
                this.notification.success('Sucesso', 'Cadastro realizado com sucesso!');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.loading = false;
                if (err.status === 400 && err.error) {
                    this.notification.error('Erro', err.error);
                } else {
                    this.notification.error('Erro', 'Não foi possível ativar o usuário.');
                }
            }
        });
    }
}
