import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskDirective } from 'ngx-mask';

import { Company } from '../../../../models/company/company';
import { CepService } from '../../../../services/cep/cep-service';
import { CompanyService } from '../../../../services/company/company.service';
import { UserService } from '../../../../services/user/user.service';
import { CustomValidators } from '../../../../utils/validators';

@Component({
  selector: 'app-edit-company',
  imports: [
      ReactiveFormsModule,
      NzInputModule,
      NzFormModule,
      NzButtonModule,
      NzAlertModule,
      NzDividerModule,
      NzSpinModule,
      CurrencyMaskModule,
      RouterModule,
      NgxMaskDirective
  ],
  templateUrl: './edit-company.html',
  styleUrl: './edit-company.scss'
})
export class EditCompany implements OnInit {
    @Input({ required: true }) company!: Company;

    form!: FormGroup;
    saving = false;
    profileId!: string | null;
    loading = false;
    loadingZipCode = false;

    constructor(
        private formBuilder: FormBuilder,
        private notification: NzNotificationService,
        private cepService: CepService,
        private companyService: CompanyService,
        private userService: UserService
    ) {
        this.form = this.formBuilder.group({
            id: [null],
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
        });
    }

    ngOnInit(): void {
        this.form.patchValue(this.company);
        this.subscribeForms();
    }

    subscribeForms(): void {
        this.form.get('zip_code')?.valueChanges
            .subscribe((zipCode: string) => {
                if (zipCode.length === 8) {
                    this.getAddress(zipCode);
                }
            });
    }

    getAddress(zipCode: string): void {
        this.loadingZipCode = true;
        this.cepService.getAddressByCep(zipCode)
            .subscribe({
                next: (address) => {
                    this.form.get('street')?.setValue(address.logradouro);
                    this.form.get('neighborhood')?.setValue(address.bairro);
                    this.form.get('state')?.setValue(address.uf);
                    this.form.get('city')?.setValue(address.localidade);
                    this.loadingZipCode = false;
                }
            })
    }

    onSubmit(): void {
        if (this.saving) {
            return;
        }

        if (this.form.valid ) {
            this.saving = true;
            this.companyService.update(this.form.value, this.company.id).subscribe({
                next: (company) => {
                    // Atualiza dados do usuário logado para refletir novo CNPJ
                    if (this.userService.userCompany) {
                        this.userService.userCompany.company = company;
                    }
                    this.saving = false;
                    this.notification.success('Sucesso!', 'Empresa atualizada com sucesso!');
                },
                error: () => {
                    this.saving = false;
                    this.notification.error('Erro', 'Ocorreu um erro ao atualizar a empresa. Por favor, tente novamente.');
                }
            });
        } else {
            this.notification.error('Erro', 'Por favor, preencha todos os campos obrigatórios corretamente.');
        }
    }
}
