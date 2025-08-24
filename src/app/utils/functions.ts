// Funções utilitárias para validação de CPF e CNPJ

export function isValidCPF(value: string): boolean {
    if (!value) return false;
    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    const digits = cpf.split('').map(d => parseInt(d, 10));
    const calcCheckDigit = (factor: number) =>
        ((digits
            .slice(0, factor - 1)
            .reduce((sum, digit, index) => sum + digit * (factor - index), 0) * 10) % 11) % 10;
    const d1 = calcCheckDigit(10);
    const d2 = calcCheckDigit(11);
    return d1 === digits[9] && d2 === digits[10];
}

export function isValidCNPJ(value: string): boolean {
    if (!value) return false;
    const cnpj = value.replace(/\D/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;
    const calcCheckDigit = (length: number) => {
        const numbers = cnpj.slice(0, length).split('').map(n => parseInt(n, 10));
        const weight = length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const sum = numbers.reduce((acc, digit, index) => acc + digit * weight[index], 0);
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };
    const d1 = calcCheckDigit(12);
    const d2 = calcCheckDigit(13);
    return d1 === parseInt(cnpj[12], 10) && d2 === parseInt(cnpj[13], 10);
}
