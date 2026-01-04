import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Observable } from 'rxjs';

import { Consumer } from '../../../models/consumer/consumer';
import { ConsumerService } from '../../../services/consumer/consumer.service';

@Component({
    selector: 'app-user-change-avatar',
    standalone: true,
    imports: [CommonModule, RouterModule, NzFormModule, NzButtonModule, NzSpinModule],
    templateUrl: './user-change-avatar.html',
    styleUrl: './user-change-avatar.scss'
})
export class UserChangeAvatar {
    consumer$!: Observable<Consumer | null>;
    previewUrl: string | null = null;
    selectedFile: File | null = null;
    uploading = false;
    loading = true;

    constructor(
        private consumerService: ConsumerService,
        private notification: NzNotificationService
    ) { }

    ngOnInit(): void {
        this.consumer$ = this.consumerService.getLoggedUser();
        // initialize preview with current consumer avatar
        this.consumer$.subscribe((c) => {
            this.previewUrl = c?.avatar ?? null;
            this.loading = false;
        }, () => this.loading = false);
    }

    triggerFile(input: HTMLInputElement): void {
        input.click();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewUrl = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    save(): void {
        if (!this.selectedFile) return;
        this.uploading = true;
        const fd = new FormData();
        fd.append('avatar', this.selectedFile);
        this.consumerService.changeAvatar(fd).subscribe({
            next: () => {
                this.uploading = false;
                // Refresh the logged user so components reflect the new avatar
                this.consumerService.refreshLoggedUser().subscribe({
                    next: () => {
                        this.notification.success('Sucesso', 'Imagem de perfil atualizada.');
                    },
                    error: () => {
                        this.notification.success('Sucesso', 'Imagem de perfil atualizada.');
                    }
                });
            },
            error: (err: any) => {
                this.uploading = false;
                this.notification.error('Erro', err?.error || 'Não foi possível atualizar a imagem.');
            }
        });
    }
}
