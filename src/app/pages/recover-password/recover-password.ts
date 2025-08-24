import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { provideNgxMask } from 'ngx-mask';

import { LoginTemplate } from '../../components/login-template/login-template';
import { LoginService } from '../../services/login/login.service';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-recuperar-senha',
    imports: [
        RouterModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        LoginTemplate
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
    emailRecover!: string;
    invalidCPf = false;
    errorCreateChangePasswordRequest!: boolean;

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private usuarioService: UserService,
        private router: Router
    ) {
        this.recoverForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.onFormChanges();
    }

    ngOnInit(): void {
        this.recoverForm.controls['email'].setValue(this.loginService.loginUsuario);
    }

    onFormChanges(): void {
        this.recoverForm.controls['email'].valueChanges.subscribe(val => {
            this.loginService.loginUsuario = val;
        });
    }

    onSubmit(): void {
        if (this.recoverForm.valid) {
            this.errorCreateChangePasswordRequest = false;
            this.invalidCPf = false;
            this.recovering = true;
            // Aqui pode ser ajustado para buscar usuário por e-mail se necessário
            this.createChangePasswordRequest(this.recoverForm.value.email);
        }
    }

    createChangePasswordRequest(email: string) {
        this.usuarioService.createChangePasswordRequest(email)
            .subscribe({
                next: (response) => {
                    this.step = 2;
                    this.recovering = false;
                },
                error: (error) => {
                    this.errorCreateChangePasswordRequest = true;
                }
            })
    }
}
