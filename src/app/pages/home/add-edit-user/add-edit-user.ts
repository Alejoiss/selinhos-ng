import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { usersHeaderConfig } from '../../../components/internal-header/internal-header-configs';
import { Profile } from '../../../models/profile/profile';
import { User } from '../../../models/user/user';
import { ProfileService } from '../../../services/profile/profile.service';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'app-add-edit-user',
    imports: [
        InternalHeader,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzSpinModule,
        NzTagModule,
        NzSelectModule,
        RouterModule,
    ],
    templateUrl: './add-edit-user.html',
    styleUrl: './add-edit-user.scss'
})
export class AddEditUser implements OnInit {
    headerConfig = usersHeaderConfig;
    form!: FormGroup;
    loading = false;
    saving = false;
    profiles: Profile[] = [];
    userId: string | null = null;

    constructor(
        private userService: UserService,
        private profileService: ProfileService,
        private notification: NzNotificationService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.form = this.formBuilder.group({
            id: [null],
            email: ['', [Validators.required, Validators.email]],
            profile_id: ['', Validators.required]
        });
        this.profileService.list().subscribe({
            next: (profiles) => {
                this.profiles = profiles;
                this.loadUserIfEdit();
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    loadUserIfEdit() {
        this.userId = this.route.snapshot.paramMap.get('id');
        if (this.userId) {
            this.userService.read(this.userId).subscribe({
                next: (user: User) => {
                    this.form.patchValue({
                        ...user,
                        is_active: user.is_active,
                        profile_id: this.getProfileIdForUser(user)
                    });
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            });
        } else {
            this.loading = false;
        }
    }

    getProfileIdForUser(user: User): string | null {
        return this.userService.userCompany?.profile.id || null;
    }

    onSubmit() {
        if (this.form.invalid) return;
        this.saving = true;
        const formValue = this.form.getRawValue();
        const request$ = this.userId
            ? this.userService.update(formValue, this.userId)
            : this.userService.create(formValue);
        request$.subscribe({
            next: () => {
                this.saving = false;
                this.notification.success('Sucesso', 'Usuário salvo com sucesso!');
                this.router.navigate(['/home/usuarios']);
            },
            error: () => {
                this.saving = false;
                this.notification.error('Erro', 'Não foi possível salvar o usuário.');
            }
        });
    }
}
