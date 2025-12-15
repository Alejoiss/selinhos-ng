import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { LoginTemplate } from '../../components/login-template/login-template';
import { ConsumerService } from '../../services/consumer/consumer.service';

@Component({
    selector: 'app-reset-password',
    imports: [
    RouterModule,
    CommonModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        LoginTemplate
    ],
    templateUrl: './reset-password.html',
    styleUrl: './reset-password.scss'
})
export class ResetPassword {
    recoverForm: FormGroup;
    passwordVisible: boolean = false;
    recovering = false;
    step: 1 | 2 = 1;
    emailRecover!: string;
    token!: string;
    tokenValid: boolean | null = null;
    passwordsEquals: boolean | null = null;

    constructor(
        private fb: FormBuilder,
        private consumerService: ConsumerService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.recoverForm = this.fb.group({
            newPassword: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]]
        });

        this.onFormChanges();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];

            this.validateToken();
        });
    }

    validateToken(): void {
        this.consumerService.validateToken(this.token)
            .subscribe({
                next: () => {
                    this.tokenValid = true;
                },
                error: () => {
                    this.tokenValid = false;
                }
            })
    }

    onFormChanges(): void {
        this.recoverForm.controls['confirmPassword'].valueChanges.subscribe(val => {
            this.passwordsEquals = val === this.recoverForm.controls['newPassword'].value;
        });
    }

    onSubmit(): void {
        if (this.recoverForm.valid && this.passwordsEquals) {
            this.recovering = true;
            this.consumerService.changeConsumerPassword(this.token, this.recoverForm.value.newPassword).subscribe({
                next: () => {
                    this.router.navigateByUrl('/login');
                },
                error: () => {
                    this.recovering = false;
                }
            });
        }
    }

    createChangePasswordRequest(cpf: string) {
        this.consumerService.createChangeConsumerPasswordRequest(cpf)
            .subscribe({
                next: () => {
                    this.step = 2;
                    this.recovering = false;
                },
            })
    }
}
