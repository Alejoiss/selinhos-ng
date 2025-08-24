import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomValidators } from '../../utils/validators';

@Injectable({
    providedIn: 'root'
})
export class RegisterUserService {

    form!: FormGroup;

    constructor(
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            cpf: ['', [Validators.required, CustomValidators.cpfValidator()]],
            email: ['', [Validators.required, Validators.email]],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            cellphone: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            plan_id: ['', [Validators.required]]
        });
    }
}
