import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { UserCompany } from '../../models/user-company/user-company';
import { User } from '../../models/user/user';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService<User> {
            validateUserInvitation(token: string): Observable<any> {
                return this.httpClient.get(`${this.url}${this.endpoint}/validate-user-invitation/`, { params: { token } });
            }

            useUserInvitation(payload: any): Observable<any> {
                return this.httpClient.post(`${this.url}${this.endpoint}/use-user-invitation/`, payload);
            }
        cancelUserInvitation(id: string): Observable<any> {
            return this.httpClient.post(`${this.url}${this.endpoint}/cancel-user-invitation/`, { id });
        }
    /**
     * Retorna true se o usuário está vinculado a uma empresa sem CNPJ preenchido
     */
    get isCompanyCnpjEmpty(): boolean {
        return !this.userCompany?.company?.cnpj.trim();
    }
    userCompany: UserCompany | null = null;

    constructor(
        public override httpClient: HttpClient
    ) {
        super(httpClient, 'registers/user');
    }

    getLoggedUser() {
        return this.httpClient.get<User>(`${this.url}${this.endpoint}/`)
            .pipe(
                shareReplay()
            );
    }

    getAllUsers(params?: any): Observable<User[]> {
        return this.httpClient.get<User[]>(`${this.url}${this.endpoint}/all-users/`, { params });
    }

    getLimit(): Observable<{ used: number; limit: number }> {
        return this.httpClient.get<{ used: number; limit: number }>(`${this.url}${this.endpoint}/get-limit/`);
    }

    createChangePasswordRequest(email: string) {
        return this.httpClient.post(`${this.url}${this.endpoint}/create-change-password-request/`, { email })
    }

    validateToken(token: string) {
        return this.httpClient.get(`${this.url}${this.endpoint}/validate-change-password-request/`, {
            params: { token }
        })
    }

    changeUserPassword(token: string, newPassword: string) {
        return this.httpClient.post(`${this.url}${this.endpoint}/change-password/`, { token, new_password: newPassword })
    }

    /**
     * Change the password for a logged-in user, expects payload with id, current_password and new_password
     */
    changeUserPasswordByUser(payload: { id: string; current_password: string; new_password: string }) {
        return this.httpClient.post(`${this.url}${this.endpoint}/change-user-password/`, payload);
    }

    createOwner(item: User): Observable<User> {
        return this.httpClient.post<User>(`${this.url}${this.endpoint}/create-owner/`, item)
    }

    setActiveStatus(id: string, is_active: boolean) {
        return this.httpClient.post(`${this.url}${this.endpoint}/set-active-status/`, { id, is_active });
    }
}
