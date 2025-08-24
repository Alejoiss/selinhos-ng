import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isValidCNPJ, isValidCPF } from './functions';

export class CustomValidators {

    static cpfValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) return null; // Não valida caso esteja vazio (campo opcional)

            if (!isValidCPF(value)) return { cpfInvalid: true };
            return null; // CPF válido
        };
    }

    static cnpjValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) return null;

            if (!isValidCNPJ(value)) return { cnpjInvalid: true };
            return null;
        };
    }
}
