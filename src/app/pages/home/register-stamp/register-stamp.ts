import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QrCodeComponent } from 'ng-qrcode';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskDirective } from 'ngx-mask';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { registerStampHeaderConfig } from '../../../components/internal-header/internal-header-configs';
import { Campaign } from '../../../models/campaign/campaign';
import { Consumer } from '../../../models/consumer/consumer';
import { StampQR } from '../../../models/stamp-qr/stamp-qr';
import { User } from '../../../models/user/user';
import { CampaignService } from '../../../services/campaign/campaign/campaign.service';
import { ConsumerService } from '../../../services/consumer/consumer.service';
import {
    ManualStampRegisterServiceService,
} from '../../../services/manual-stamp-register/manual-stamp-register.service.service';
import { StampQRService } from '../../../services/stamp-qr/stamp-qr.service';
import { UserService } from '../../../services/user/user.service';
import { CustomValidators } from '../../../utils/validators';


@Component({
    selector: 'app-register-stamp',
    imports: [
        InternalHeader,
        NzButtonModule,
        NzFormModule,
        NzSelectModule,
        ReactiveFormsModule,
        CurrencyMaskModule,
        QrCodeComponent,
        NzModalModule,
        NgxMaskDirective,
        NzSwitchModule
    ],
    templateUrl: './register-stamp.html',
    styleUrl: './register-stamp.scss'
})
export class RegisterStamp {
    headerConfig = registerStampHeaderConfig;

    buttonSelected: 'manual' | 'qrcode' = 'qrcode';
    campaigns: Campaign[] = [];
    consumers: Consumer[] = [];
    form!: FormGroup;
    loading = false;
    qrCodeValue = '';
    isVisible = false;
    foundUser: User | null = null;
    userSearchStatus: 'success' | 'warning' | null = null;

    constructor(
        private consumerService: ConsumerService,
        private campaignService: CampaignService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private notification: NzNotificationService,
        private manualStampRegisterService: ManualStampRegisterServiceService,
        private stampQRService: StampQRService
    ) {
        this.form = this.formBuilder.group({
            type: 'qrcode',
            cpf: [null],
            consumer: [null],
            campaign: [null, [Validators.required]],
            stamps: [0, [Validators.required, Validators.min(1)]],
            value: [0]
        });
    }

    ngOnInit(): void {
        this.loadConsumers();
        this.loadCampaigns();
        this.subscribeForms();
        this.checkPermissions();
    }

    loadConsumers(): void {
        this.consumerService.list().subscribe((consumers) => {
            this.consumers = consumers;
        });
    }

    loadCampaigns(): void {
        this.campaignService.list().subscribe((campaigns) => {
            this.campaigns = campaigns;

            this.campaigns.forEach((campaign) => {
                if (campaign.is_main_campaign) {
                    this.form.patchValue({ campaign: campaign.id });
                }
            });
        });
    }

    selectButton(button: 'manual' | 'qrcode'): void {
        this.buttonSelected = button;

        if (button === 'manual') {
            this.form.get('cpf')?.addValidators([Validators.required, CustomValidators.cpfValidator()]);
            this.form.patchValue({ type: 'manual' });
        } else {
            this.form.get('cpf')?.clearValidators();
            this.form.patchValue({ type: 'qrcode' });
        }
        this.form.get('cpf')?.updateValueAndValidity();
    }

    subscribeForms(): void {
        this.form.get('campaign')?.valueChanges
            .subscribe(() => {
                this.calculateStampsNumber();
            });

        this.form.get('value')?.valueChanges
            .subscribe(() => {
                this.calculateStampsNumber();
            });

        this.form.get('cpf')?.valueChanges.subscribe((cpf: string) => {
            if (this.buttonSelected !== 'manual') return;
            if (!this.form.get('cpf')?.valid) {
                this.foundUser = null;
                this.userSearchStatus = null;
                return;
            }
            this.loading = true;
            const params = new HttpParams()
                .append('page', '1')
                .append('results', '1')
                .append('cpf', cpf);
            this.consumerService.list(params).subscribe({
                next: (data: any) => {
                    const users = data.results;
                    this.loading = false;
                    if (users && users.length > 0) {
                        this.foundUser = users[0];
                        this.userSearchStatus = 'success';
                        this.form.patchValue({ consumer: this.foundUser?.id });
                    } else {
                        this.foundUser = null;
                        this.userSearchStatus = 'warning';
                    }
                },
                error: () => {
                    this.loading = false;
                    this.foundUser = null;
                    this.userSearchStatus = 'warning';
                }
            });
        });
    }

    calculateStampsNumber(): void {
        const selectedCampaign = this.campaigns.find(campaign => campaign.id === this.form.get('campaign')?.value);
        const value = this.form.get('value')?.value || 0;

        if (selectedCampaign && selectedCampaign.price_by_stamp > 0) {
            const stamps = Math.floor(value / selectedCampaign.price_by_stamp);
            this.form.patchValue({ stamps: stamps });
        } else {
            this.form.patchValue({ stamps: 0 });
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsDirty();
            this.form.updateValueAndValidity();
            return;
        }

        this.loading = true;
        if (this.buttonSelected === 'manual') {
            this.registerStamps();
        } else {
            this.registerQRCode();
        }
    }

    registerStamps(): void {
        const formData = this.form.value;
        this.manualStampRegisterService.create(formData).subscribe({
            next: () => {
                this.loading = false;
                this.notification.success('Sucesso', 'Selos registrados com sucesso!');
                this.form.patchValue({ cpf: null, consumer: null, stamps: 0, value: 0 });
                this.foundUser = null;
                this.userSearchStatus = null;
            },
            error: () => {
                this.loading = false;
                this.notification.error('Erro', 'Falha ao registrar selos.');
            }
        });
    }

    registerQRCode(): void {
        const formData = this.form.value;
        this.stampQRService.create(formData).subscribe({
            next: (data: StampQR) => {
                this.loading = false;
                this.qrCodeValue = data.token;
                this.showModal();
                this.form.patchValue({ cpf: null, consumer: null, stamps: 0, value: 0 });
            },
            error: () => {
                this.loading = false;
                this.notification.error('Erro', 'Falha ao gerar QR Code.');
            }
        });
    }

    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        this.isVisible = false;
    }

    checkPermissions(): void {
        if (!this.userService.userCompany?.profile?.can_change_stamps_quantity) {
            this.form.get('stamps')?.disable();
        }
    }
}
