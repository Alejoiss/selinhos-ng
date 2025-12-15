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

    static handleValidator(): ValidatorFn {
        // Aceita opcional `@` no início, seguido de letras, dígitos, underscore ou ponto.
        const handleRegex = /^@?[A-Za-z0-9_.]+$/;
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) return null; // Não valida vazio — deixe o `required` tratar disso

            if (!handleRegex.test(value)) return { handleInvalid: true };
            return null;
        };
    }
}
