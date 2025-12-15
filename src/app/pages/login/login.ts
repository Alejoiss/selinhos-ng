import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgxMaskDirective } from 'ngx-mask';

import { LoginTemplate } from '../../components/login-template/login-template';
import { LoginService } from '../../services/login/login.service';
import { CustomValidators } from '../../utils/validators';

@Component({
    selector: 'app-login',
    imports: [
    RouterModule,
    CommonModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        LoginTemplate,
        NgxMaskDirective
    ],
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class Login implements OnInit{
    loginForm: FormGroup;
    passwordVisible: boolean = false;
    logando = false;
    loginError = false;

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            cpf: ['', [Validators.required, CustomValidators.cpfValidator()]],
            password: ['', [Validators.required]]
        });

        this.onFormChanges();
    }

    ngOnInit(): void {
        this.loginService.removerSessao();
        this.loginService.loginUsuario = '';
    }

    onFormChanges(): void {
        this.loginForm.controls['cpf'].valueChanges.subscribe(val => {
            this.loginService.loginUsuario = val;
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.logando = true;
            this.loginError = false;
            const cpf = this.loginForm.value.cpf?.toString().trim();
            this.loginService.login(cpf, this.loginForm.value.password).subscribe({
                next: (response) => {
                    this.loginService.guardarSessao(response);
                    this.router.navigate(['/home']);
                },
                error: (error) => {
                    this.logando = false;
                    this.loginError = true;
                }
            });
        } else {
            Object.values(this.loginForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }
}
