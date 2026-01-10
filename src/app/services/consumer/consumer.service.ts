import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Consumer } from '../../models/consumer/consumer';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class ConsumerService extends BaseService<Consumer> {

    private consumerSubject = new BehaviorSubject<Consumer | null>(null);

    constructor(
        http: HttpClient
    ) {
        super(http, 'registers/consumer');
    }

    /**
     * Fetch and emit the logged user into the subject
     */
    refreshLoggedUser(): Observable<Consumer | null> {
        return this.httpClient.get<Consumer>(`${this.url}${this.endpoint}/`).pipe(
            tap(user => this.consumerSubject.next(user)),
            switchMap(user => of(user))
        );
    }

    getLoggedUser() {
        // If we already have a value, return it as observable; otherwise fetch
        if (!this.consumerSubject.getValue()) {
            this.refreshLoggedUser().subscribe();
        }
        return this.consumerSubject.asObservable();
    }

    setLoggedUser(consumer: Consumer | null) {
        this.consumerSubject.next(consumer);
    }

    /**
     * Upload a new avatar using form data with key 'avatar'
     */
    changeAvatar(fd: FormData) {
        return this.httpClient.post(`${this.url}${this.endpoint}/change-avatar/`, fd);
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
