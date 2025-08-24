import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { campaignsHeaderConfig } from '../../../components/internal-header/internal-header-configs';
import { CampaignService } from '../../../services/campaign/campaign/campaign.service';

@Component({
    selector: 'app-add-edit-campaign',
    imports: [
        InternalHeader,
        ReactiveFormsModule,
        NzSwitchModule,
        NzInputModule,
        NzFormModule,
        NzButtonModule,
        NzSpinModule,
        CurrencyMaskModule,
        RouterModule
    ],
    templateUrl: './add-edit-campaign.html',
    styleUrl: './add-edit-campaign.scss'
})
export class AddEditCampaign {
    headerConfig = campaignsHeaderConfig;

    form!: FormGroup;
    saving = false;
    campaignId!: string | null;
    loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private campaignService: CampaignService,
        private notification: NzNotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.formBuilder.group({
            id: [null],
            company: [null],
            name: ['', [Validators.required]],
            active: [true],
            is_main_campaign: [false],
            prize: ['', [Validators.required]],
            description: ['', [Validators.required]],
            price_by_stamp: [0, [Validators.required]],
            quantity_stamps: [0, [Validators.required, Validators.max(100), Validators.min(1)]],
        });
    }

    ngOnInit(): void {
        this.campaignId = this.route.snapshot.paramMap.get('id');
        if (this.campaignId) {
            this.loading = true;
            this.getCampaign();
        }
    }

    getCampaign(): void {
        this.campaignService.read(this.campaignId!).subscribe({
            next: (data: any) => {
                this.loading = false;
                this.form.patchValue(data);
            },
            error: (error: any) => {
                this.loading = false;
                this.notification.create(
                    'error',
                    'Erro ao carregar campanha',
                    'Ocorreu um erro ao carregar a campanha. Por favor, tente novamente.'
                );
            }
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            if (this.saving) {
                return;
            }

            this.saving = true;
            const formData = this.form.value;

            if (this.campaignId) {
                this.edit(formData);
            } else {
                this.save(formData);
            }
        } else {
            this.form.markAllAsDirty();
            this.form.updateValueAndValidity();
        }
    }

    save(formData: any): void {
        this.campaignService.create(formData).subscribe({
            next: (response: any) => {
                this.notification.create(
                    'success',
                    'Campanha criada com sucesso',
                    'A campanha foi criada com sucesso.'
                );
                this.router.navigate(['/home/campanhas']);
            },
            error: (error: any) => {
                this.notification.create(
                    'error',
                    'Erro ao criar campanha',
                    'Ocorreu um erro ao criar a campanha. Por favor, tente novamente.'
                );
            }
        });
    }

    edit(formData: any): void {
        this.campaignService.update(formData, this.campaignId).subscribe({
            next: (response: any) => {
                this.notification.create(
                    'success',
                    'Campanha atualizada com sucesso',
                    'A campanha foi atualizada com sucesso.'
                );
                this.router.navigate(['/home/campanhas']);
            },
            error: (error: any) => {
                this.notification.create(
                    'error',
                    'Erro ao atualizar campanha',
                    'Ocorreu um erro ao atualizar a campanha. Por favor, tente novamente.'
                );
            }
        });
    }
}
