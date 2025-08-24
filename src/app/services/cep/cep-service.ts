import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NoAuthorizationHttpParams } from '../../interceptors/auth-interceptor';

export class ZipCodeResponse {
    cep!: string;
    logradouro!: string;
    complemento!: string;
    unidade!: string;
    bairro!: string;
    localidade!: string;
    uf!: string;
    estado!: string;
    regiao!: string;
    ibge!: string;
    gia!: string;
    ddd!: string;
    siafi!: string;
}

@Injectable({
    providedIn: 'root'
})
export class CepService {
    constructor(
        private http: HttpClient
    ) { }

    getAddressByCep(cep: string): Observable<ZipCodeResponse> {
        return this.http.get<ZipCodeResponse>(`https://viacep.com.br/ws/${cep}/json/`, {
            mode: 'cors',
            params: new NoAuthorizationHttpParams()
        });
    }
}
