import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpfPrivacyMask', standalone: true })
export class CpfPrivacyMaskPipe implements PipeTransform {
    transform(value?: string): string {
        if (!value) return '';
        const cpf = value.replace(/\D/g, '');
        if (cpf.length !== 5) return value;
        return `${cpf.substring(0,3)}.***.***-${cpf.substring(3,5)}`;
    }
}
