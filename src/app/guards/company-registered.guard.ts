import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../services/user/user.service';


@Injectable({ providedIn: 'root' })
export class CompanyRegisteredGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) { }

    canActivate(): Observable<boolean | UrlTree> {
        return this.userService.getLoggedUser().pipe(
            map(user => {
                // Atualiza userCompany com base no usuário retornado
                const companyId = window.localStorage.getItem('company');
                this.userService.userCompany = user.user_usercompanies?.find(uc => uc.company.id === companyId) || null;
                // Agora verifica se o CNPJ está preenchido
                if (!this.userService.isCompanyCnpjEmpty) {
                    return true;
                }
                return this.router.createUrlTree(['/home']);
            })
        );
    }
}
