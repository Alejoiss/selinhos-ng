import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxMaskDirective } from 'ngx-mask';

import { Plan } from '../../models/plan/plan';
import { PlanService } from '../../services/plan/plan.service';
import { RegisterUserService } from '../../services/register-user/register-user.service';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-register',
    imports: [
    NgxMaskDirective,
    CommonModule,
        ReactiveFormsModule,
        DecimalPipe,
        RouterModule,
        NzAlertModule,
    ],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class Register implements OnInit {
    plans: Plan[] = [];
    passwordVisible = false;
    addingUser = false;

    constructor(
        private notification: NzNotificationService,
        public registerUserService: RegisterUserService,
        private userService: UserService,
        private planService: PlanService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const planId = window.localStorage.getItem('selected_plan_id');
        if (planId) {
            this.registerUserService.form.patchValue({ plan_id: planId });
        }

        this.planService.list().subscribe(plans => {
            this.plans = plans;
        });
    }

    onSubmit(): void {
        if (this.addingUser) {
            return;
        }
        if (this.registerUserService.form.valid) {
            this.addingUser = true;
            this.userService.createOwner(this.registerUserService.form.value).subscribe({
                next: () => {
                    this.notification.create(
                        'success',
                        'Usuário criado com sucesso',
                        'Agora você já pode fazer login na nossa plataforma.'
                    );
                    window.localStorage.removeItem('selected_plan_id');
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    let message = 'Ocorreu um erro ao criar o usuário. Por favor, tente novamente mais tarde.';
                    if (err.status === 400 && err.error?.error === 'USER_ALREADY_EXISTS') {
                        message = 'Usuário já existe com este e-mail.';
                    }
                    this.notification.create(
                        'error',
                        'Erro ao criar usuário',
                        message
                    );
                    this.addingUser = false;
                }
            });
        } else {
            this.addingUser = false;
            this.notification.create(
                'warning',
                'Formulário inválido',
                'Por favor, preencha todos os campos corretamente antes de enviar.'
            );
        }
    }
}
