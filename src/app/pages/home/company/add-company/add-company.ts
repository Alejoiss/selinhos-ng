import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxMaskDirective } from 'ngx-mask';
import { Subject, takeUntil } from 'rxjs';

import { InternalHeader } from '../../../../components/internal-header/internal-header';
import { addCompanyHeaderConfig } from '../../../../components/internal-header/internal-header-configs';
import { Company } from '../../../../models/company/company';
import { Plan } from '../../../../models/plan/plan';
import { CepService } from '../../../../services/cep/cep-service';
import { CompanyService } from '../../../../services/company/company.service';
import { PlanService } from '../../../../services/plan/plan.service';
import { CustomValidators } from '../../../../utils/validators';

@Component({
    selector: 'app-add-company',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzInputModule,
        NzFormModule,
        NzButtonModule,
        NzAlertModule,
        NzDividerModule,
        NzSpinModule,
        NzSelectModule,
        RouterModule,
        NgxMaskDirective,
        InternalHeader
    ],
    templateUrl: './add-company.html',
    styleUrl: './add-company.scss'
})
export class AddCompany implements OnInit, OnDestroy {
    headerConfig = addCompanyHeaderConfig;
    form!: FormGroup;
    saving = false;
    plans: Plan[] = [];
    loadingZipCode = false;
    subscriptionBreak$ = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private notification: NzNotificationService,
        private companyService: CompanyService,
        private cepService: CepService,
        private planService: PlanService,
        private router: Router
    ) {
        this.form = this.formBuilder.group({
            cnpj: [null, [Validators.required, CustomValidators.cnpjValidator()]],
            name: [null, Validators.required],
            legal_name: [null, Validators.required],
            zip_code: [null, Validators.required],
            street: [null, Validators.required],
            number: [null, Validators.required],
            complement: [null],
            neighborhood: [null, Validators.required],
            state: [null, Validators.required],
            city: [null, Validators.required],
            plan_id: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.planService.list().subscribe({
            next: (plans) => this.plans = plans
        });

        this.subscribeForms();
    }

    subscribeForms(): void {
        this.form.get('zip_code')?.valueChanges
            .pipe(takeUntil(this.subscriptionBreak$))
            .subscribe((zipCode: string) => {
                if (zipCode && zipCode.length === 8) {
                    this.getAddress(zipCode);
                }
            });
    }

    getAddress(zipCode: string): void {
        this.loadingZipCode = true;
        this.cepService.getAddressByCep(zipCode).subscribe({
            next: (address) => {
                this.form.get('street')?.setValue(address.logradouro);
                this.form.get('neighborhood')?.setValue(address.bairro);
                this.form.get('state')?.setValue(address.uf);
                this.form.get('city')?.setValue(address.localidade);
                this.loadingZipCode = false;
            },
            error: () => {
                this.loadingZipCode = false;
            }
        });
    }

    onSubmit(): void {
        if (this.saving) return;
        if (this.form.valid) {
            this.saving = true;
            const payload: any = this.form.value;
            this.companyService.addNewCompany(payload).subscribe({
                next: (company: Company) => {
                    this.router.navigate(['/home/empresa']);
                    this.companyService.setStoredCompany(company.id);
                    window.location.reload();
                },
                error: (err: any) => {
                    this.saving = false;
                    if (err.status === 400) {
                        this.notification.error('Erro', 'Empresa já existe com este CNPJ.');
                    } else {
                        this.notification.error('Erro', 'Ocorreu um erro ao cadastrar a empresa. Por favor, tente novamente.');
                    }
                }
            });
        } else {
            this.notification.warning('Formulário inválido', 'Por favor, preencha todos os campos obrigatórios corretamente.');
        }
    }

    ngOnDestroy(): void {
        this.subscriptionBreak$.next();
        this.subscriptionBreak$.complete();
    }
}
