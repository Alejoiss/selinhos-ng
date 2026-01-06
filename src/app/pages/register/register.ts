import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxMaskDirective } from 'ngx-mask';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { TermsModal } from '../../components/terms-modal/terms-modal';
import { ConsumerService } from '../../services/consumer/consumer.service';
import { CustomValidators } from '../../utils/validators';

@Component({
    selector: 'app-register',
    imports: [
    NgxMaskDirective,
    CommonModule,
        ReactiveFormsModule,
        RouterModule,
        NzAlertModule,
        NzModalModule
    ],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class Register implements OnInit {
    passwordVisible = false;
    addingUser = false;
    form!: FormGroup;
    handleExists: boolean | null = null; // null = unknown/empty, true = exists, false = available
    emailExists: boolean | null = null;
    cpfExists: boolean | null = null;

    private handleSub?: Subscription;
    private emailSub?: Subscription;
    private cpfSub?: Subscription;

    constructor(
        private notification: NzNotificationService,
        private consumerService: ConsumerService,
        private router: Router,
        private fb: FormBuilder,
        private modal: NzModalService
    ) {
        this.form = this.fb.group({
            cpf: ['', [Validators.required, CustomValidators.cpfValidator()]],
            email: ['', [Validators.required, Validators.email]],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            cellphone: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            birthday: ['', [Validators.required]],
            handle: ['', [Validators.required, CustomValidators.handleValidator()]],
            accepted_terms: [false, [Validators.requiredTrue]]
        });
    }

    ngOnInit(): void {
        this.setupHandleValidation();
        this.setupEmailValidation();
        this.setupCpfValidation();
    }

    /**
     * Inicializa validação do handle com debounce e distinctUntilChanged
     */
    private setupHandleValidation(): void {
        const handleControl = this.form.get('handle');
        if (!handleControl) {
            return;
        }
        this.handleSub = handleControl.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((value: string) => {
                const handle = (value || '').toString().trim().replace(/^@/, '');
                if (!handle || !handleControl.valid) {
                    this.handleExists = null;
                    return of(null);
                }
                return this.consumerService.checkHandle(handle).pipe(
                    catchError(() => of(null))
                );
            })
        ).subscribe((res: boolean | null) => {
            this.handleExists = res === null ? null : res;
        });
    }

    /**
     * Inicializa validação do e-mail com debounce e distinctUntilChanged
     */
    private setupEmailValidation(): void {
        const emailControl = this.form.get('email');
        if (!emailControl) {
            return;
        }
        this.emailSub = emailControl.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((value: string) => {
                const email = (value || '').toString().trim();
                if (!email || !emailControl.valid) {
                    this.emailExists = null;
                    return of(null);
                }
                return this.consumerService.checkEmail(email).pipe(
                    catchError(() => of(null))
                );
            })
        ).subscribe((res: boolean | null) => {
            this.emailExists = res === null ? null : res;
        });
    }

    /**
     * Inicializa validação do CPF com debounce e distinctUntilChanged
     */
    private setupCpfValidation(): void {
        const cpfControl = this.form.get('cpf');
        if (!cpfControl) {
            return;
        }
        this.cpfSub = cpfControl.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((value: string) => {
                const cpf = (value || '').toString().trim();
                if (!cpf || !cpfControl.valid) {
                    this.cpfExists = null;
                    return of(null);
                }
                return this.consumerService.checkCpf(cpf).pipe(
                    catchError(() => of(null))
                );
            })
        ).subscribe((res: boolean | null) => {
            this.cpfExists = res === null ? null : res;
        });
    }

    onSubmit(): void {
        if (this.addingUser) {
            return;
        }
        if (this.form.valid) {
            // Prevent submit if backend checks already report conflicts
            if (this.handleExists === true || this.emailExists === true || this.cpfExists === true) {
                this.notification.create(
                    'warning',
                    'Conflito de dados',
                    'Handle, e-mail ou CPF já estão em uso. Corrija os campos antes de enviar.'
                );
                return;
            }

            this.addingUser = true;

            // Prepare payload: trim strings and remove leading @ from handle
            const payload: any = { ...this.form.value };
            if (payload.handle) {
                payload.handle = payload.handle.toString().trim().replace(/^@/, '');
            }
            if (payload.email) payload.email = payload.email.toString().trim();
            if (payload.first_name) payload.first_name = payload.first_name.toString().trim();
            if (payload.last_name) payload.last_name = payload.last_name.toString().trim();
            if (payload.cpf) payload.cpf = payload.cpf.toString().trim();

            this.consumerService.create(payload).subscribe({
                next: () => {
                    this.notification.create(
                        'success',
                        'Usuário criado com sucesso',
                        'Agora você já pode fazer login na nossa plataforma.'
                    );
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    let message = 'Ocorreu um erro ao criar o usuário. Por favor, tente novamente mais tarde.';

                    // Try to extract useful message from backend response
                    if (err?.error) {
                        if (typeof err.error === 'string') {
                            message = err.error;
                        } else if (err.error?.detail) {
                            message = err.error.detail;
                        } else if (typeof err.error === 'object') {
                            const firstKey = Object.keys(err.error)[0];
                            const val = err.error[firstKey];
                            if (Array.isArray(val) && val.length) {
                                message = val[0];
                            } else if (typeof val === 'string') {
                                message = val;
                            }
                        }
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

    openTerms(event: Event): void {
        event.preventDefault();
        this.modal.create({
            nzTitle: 'Termos de Uso',
            nzContent: TermsModal,
            nzFooter: null,
            nzWidth: 800,
            nzMaskClosable: true
        });
    }

    ngOnDestroy(): void {
        this.handleSub?.unsubscribe();
        this.emailSub?.unsubscribe();
        this.cpfSub?.unsubscribe();
    }
}
