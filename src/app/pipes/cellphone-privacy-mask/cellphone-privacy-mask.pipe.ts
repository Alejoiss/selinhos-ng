import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cellphonePrivacyMask'
})
export class CellphonePrivacyMaskPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): unknown {
        if (!value || typeof value !== 'string') {
            return value;
        }
        const cellphone = value.replace(/\D/g, '');
        if (cellphone.length !== 7) {
            return value;
        }
        // Vem como 4693075 e retorna como (46) 9****-3075
        return `(${cellphone.substring(0, 2)}) ${cellphone.substring(2, 3)}****-${cellphone.substring(3, 7)}`;
    }

}
