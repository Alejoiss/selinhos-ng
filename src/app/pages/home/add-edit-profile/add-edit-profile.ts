import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { profilesHeaderConfig } from '../../../components/internal-header/internal-header-configs';
import { Profile } from '../../../models/profile/profile';
import { ProfileService } from '../../../services/profile/profile.service';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'app-add-edit-rule',
    imports: [
        InternalHeader,
        ReactiveFormsModule,
        NzSwitchModule,
        NzInputModule,
        NzFormModule,
        NzButtonModule,
        NzSpinModule,
        NzAlertModule,
        CurrencyMaskModule,
        RouterModule
    ],
    templateUrl: './add-edit-profile.html',
    styleUrl: './add-edit-profile.scss'
})
export class AddEditProfile {
    headerConfig = profilesHeaderConfig;

    form!: FormGroup;
    saving = false;
    profileId!: string | null;
    loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private profileService: ProfileService,
        private userService: UserService,
        private notification: NzNotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.formBuilder.group({
            id: [null],
            company: [null],
            editable: [true],
            name: [null, Validators.required],
            can_access_companies_menu: [false],
            can_access_users_menu: [false],
            can_access_plans_menu: [false],
            can_access_campaign_menu: [false],
            can_access_customers_menu: [false],
            can_access_dashboard: [false],
            can_register_stamps: [false],
            can_access_profile_menu: [false],
        });
    }

    ngOnInit(): void {
        this.profileId = this.route.snapshot.paramMap.get('id');
        if (this.profileId) {
            this.loading = true;
            this.getProfile();
        }
    }

    getProfile(): void {
        this.profileService.read(this.profileId!).subscribe({
            next: (data) => {
                this.loading = false;
                this.form.patchValue(data);

                if (data.editable === false) {
                    this.form.disable();
                }
            },
            error: (error) => {
                this.loading = false;
                this.notification.create(
                    'error',
                    'Erro ao carregar perfil',
                    'Ocorreu um erro ao carregar o perfil. Por favor, tente novamente.'
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

            if (this.profileId) {
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
        this.profileService.create(formData).subscribe({
            next: (response) => {
                this.notification.create(
                    'success',
                    'Perfil criado com sucesso',
                    'O perfil foi criado com sucesso.'
                );
                this.updateCurrentProfile(response);
                this.router.navigate(['/home/perfis']);
            },
            error: (error) => {
                this.notification.create(
                    'error',
                    'Erro ao criar perfil',
                    'Ocorreu um erro ao criar o perfil. Por favor, tente novamente.'
                );
            }
        });
    }

    edit(formData: any): void {
        this.profileService.update(formData, this.profileId).subscribe({
            next: (response) => {
                this.notification.create(
                    'success',
                    'Perfil atualizado com sucesso',
                    'O perfil foi atualizado com sucesso.'
                );
                this.updateCurrentProfile(response);
                this.router.navigate(['/home/perfis']);
            },
            error: (error) => {
                this.notification.create(
                    'error',
                    'Erro ao atualizar perfil',
                    'Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente.'
                );
            }
        });
    }

    updateCurrentProfile(profile: Profile): void {
        if (this.userService.userCompany && this.userService.userCompany.profile?.id === profile.id) {
            this.userService.userCompany.profile = profile;
        }
    }
}
