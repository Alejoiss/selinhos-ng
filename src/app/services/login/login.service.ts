import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Token } from '../../models/token/token';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private http: HttpClient) { }
    loginUsuario = '';

    login(emailOrCpf: string, password: string) {
        // The backend expects cpf instead of email for login
        return this.http.post<Token>(`${environment.apiUrl}api/token/`, {
            cpf: emailOrCpf,
            password: password
        });
    }

    guardarSessao(auth: Token): void {
        window.localStorage.setItem('consumer', JSON.stringify(auth));
    }

    removerSessao(): void {
        window.localStorage.removeItem('consumer');
    }
}
