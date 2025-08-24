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

    login(email: string, password: string) {
        return this.http.post<Token>(`${environment.apiUrl}api/token/`, {
            email: email,
            password: password
        });
    }

    guardarSessao(auth: Token): void {
        window.localStorage.setItem('user', JSON.stringify(auth));
    }

    removerSessao(): void {
        window.localStorage.removeItem('user');
    }
}
