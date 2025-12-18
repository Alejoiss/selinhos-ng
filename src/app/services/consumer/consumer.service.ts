import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { Consumer } from '../../models/consumer/consumer';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class ConsumerService extends BaseService<Consumer> {

    constructor(
        http: HttpClient
    ) {
        super(http, 'registers/consumer');
    }

    /**
     * Verifica se um handle já está em uso.
     * Retorna true se já existe, false caso contrário.
     */
    checkHandle(handle: string): Observable<boolean> {
        const params = new HttpParams().set('handle', handle);
        return this.httpClient.get<boolean>(`${this.url}${this.endpoint}/check-handle/`, { params });
    }

    /**
     * Verifica se um CPF já está em uso.
     */
    checkCpf(cpf: string): Observable<boolean> {
        const params = new HttpParams().set('cpf', cpf);
        return this.httpClient.get<boolean>(`${this.url}${this.endpoint}/check-cpf/`, { params });
    }

    /**
     * Verifica se um e-mail já está em uso.
     */
    checkEmail(email: string): Observable<boolean> {
        const params = new HttpParams().set('email', email);
        return this.httpClient.get<boolean>(`${this.url}${this.endpoint}/check-email/`, { params });
    }

    getLoggedUser() {
        return this.httpClient.get<Consumer>(`${this.url}${this.endpoint}/`)
            .pipe(
                shareReplay()
            );
    }

    createChangeConsumerPasswordRequest(cpf: string) {
        return this.httpClient.post(`${this.url}${this.endpoint}/create-change-consumer-password-request/`, { cpf })
    }

    validateToken(token: string) {
        return this.httpClient.get(`${this.url}${this.endpoint}/validate-change-consumer-password-request/`, {
            params: { token }
        })
    }

    changeConsumerPassword(token: string, newPassword: string) {
        return this.httpClient.post(`${this.url}${this.endpoint}/change-password/`, { token, new_password: newPassword })
    }

    /**
     * Change the password for a logged-in user, expects payload with id, current_password and new_password
     */
    changeConsumerPasswordByUser(payload: { id: string; current_password: string; new_password: string }) {
        return this.httpClient.post(`${this.url}${this.endpoint}/change-consumer-password/`, payload);
    }

    /**
     * Salva a cidade selecionada pelo consumidor autenticado.
     * Envia { city_id } e retorna 200 se ok.
     */
    saveSelectedCity(city_id: number) {
        return this.httpClient.post(`${this.url}${this.endpoint}/save-selected-city/`, { city_id });
    }
}
