import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { LoginTemplate } from '../../components/login-template/login-template';
import { LoginService } from '../../services/login/login.service';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-login',
    imports: [
    RouterModule,
    CommonModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        LoginTemplate
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
        private router: Router,
        private userService: UserService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });

        this.onFormChanges();
    }

    ngOnInit(): void {
        this.loginService.removerSessao();
        this.loginService.loginUsuario = '';
    }

    onFormChanges(): void {
        this.loginForm.controls['email'].valueChanges.subscribe(val => {
            this.loginService.loginUsuario = val;
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.logando = true;
            this.loginError = false;
            this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
                next: (response) => {
                    this.loginService.guardarSessao(response);
                    this.verifyUserCompanies();
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

    verifyUserCompanies() {
        this.userService.getLoggedUser()
            .subscribe({
                next: (user) => {
                    const companyId = window.localStorage.getItem('company');
                    this.userService.userCompany = user.user_usercompanies?.find(uc => uc.company.id === companyId) || null;
                    this.router.navigate(['/home']);
                },
                error: () => {
                    window.localStorage.removeItem('company');
                    this.router.navigate(['/home']);
                }
            });
    }
}
