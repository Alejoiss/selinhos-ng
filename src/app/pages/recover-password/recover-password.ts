import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { LoginTemplate } from '../../components/login-template/login-template';
import { ConsumerService } from '../../services/consumer/consumer.service';
import { LoginService } from '../../services/login/login.service';
import { CustomValidators } from '../../utils/validators';

@Component({
    selector: 'app-recuperar-senha',
    imports: [
        RouterModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        LoginTemplate,
        NgxMaskDirective
    ],
    providers: [provideNgxMask()],
    templateUrl: './recover-password.html',
    styleUrl: './recover-password.scss'
})
export class RecoverPassword {
    recoverForm: FormGroup;
    passwordVisible: boolean = false;
    recovering = false;
    step: 1 | 2 = 1;
    cpfRecover!: string;
    invalidCPf = false;
    errorCreateChangePasswordRequest!: boolean;

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private consumerService: ConsumerService,
        private router: Router
    ) {
        this.recoverForm = this.fb.group({
            cpf: ['', [Validators.required, CustomValidators.cpfValidator()]]
        });

        this.onFormChanges();
    }

    ngOnInit(): void {
        this.recoverForm.controls['cpf'].setValue(this.loginService.loginUsuario);
    }

    onFormChanges(): void {
        this.recoverForm.controls['cpf'].valueChanges.subscribe(val => {
            this.loginService.loginUsuario = val;
        });
    }

    onSubmit(): void {
        if (this.recoverForm.valid) {
            this.errorCreateChangePasswordRequest = false;
            this.invalidCPf = false;
            this.recovering = true;
            // Aqui pode ser ajustado para buscar usuário por e-mail se necessário
            this.createChangePasswordRequest(this.recoverForm.value.cpf);
        }
    }

    createChangePasswordRequest(cpf: string) {
        this.consumerService.createChangeConsumerPasswordRequest(cpf)
            .subscribe({
                next: () => {
                    this.cpfRecover = cpf;
                    this.step = 2;
                    this.recovering = false;
                },
                error: () => {
                    this.errorCreateChangePasswordRequest = true;
                }
            })
    }
}
