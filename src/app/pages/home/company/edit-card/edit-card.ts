import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxMaskDirective } from 'ngx-mask';

import { CardOnFile } from '../../../../models/card-on-file/card-on-file';

@Component({
  selector: 'app-edit-card',
  imports: [
      ReactiveFormsModule,
      NzInputModule,
      NzFormModule,
      NzButtonModule,
      NzAlertModule,
      NzDividerModule,
      NgxMaskDirective,
      RouterModule
  ],
  templateUrl: './edit-card.html',
  styleUrl: './edit-card.scss'
})
export class EditCard {
    @Input({ required: true }) card!: CardOnFile;

    form!: FormGroup;
    saving = false;
    profileId!: string | null;
    loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private notification: NzNotificationService,
        private router: Router,
    ) {
        this.form = this.formBuilder.group({
            id: [null],
            cardNumber: [null, Validators.required],
            name: [null, Validators.required],
            expiryDate: [null, Validators.required],
            cvv: [null, Validators.required],
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.saving = true;
            // Simulate save operation
            setTimeout(() => {
                this.saving = false;
                this.notification.success('Success', 'Company details saved successfully');
                this.router.navigate(['/companies']);
            }, 2000);
        } else {
            this.notification.error('Error', 'Please fill in all required fields');
        }
    }
}
