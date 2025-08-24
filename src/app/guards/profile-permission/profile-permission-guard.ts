import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';

import { UserService } from '../../services/user/user.service';

export const profilePermissionGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    const requiredPermissions: string[] = route.data?.['permissions'] || [];

    return userService.getLoggedUser().pipe(
        map(user => {
            const companyId = window.localStorage.getItem('company');
            const userCompany = user.user_usercompanies?.find(uc => uc.company.id === companyId);

            if (!userCompany) {
                return false;
            }

            const profile = userCompany.profile;
            if (!profile) {
                return false;
            }

            for (const permission of requiredPermissions) {
                if (!(profile as any)[permission]) {
                    return false;
                }
            }

            return true;
        })
    );
};
