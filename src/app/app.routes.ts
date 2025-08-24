import { Routes } from '@angular/router';

import { CompanyRegisteredGuard } from './guards/company-registered.guard';
import { loggedUserGuard } from './guards/logged-user/logged-user-guard';
import { profilePermissionGuard } from './guards/profile-permission/profile-permission-guard';

export const routes: Routes = [
    {
        path: 'registro',
        loadComponent: () => import('./pages/register/register').then(m => m.Register)
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.Home),
        canActivate: [loggedUserGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/home/dashboard/dashboard').then(m => m.Dashboard),
                title: 'Selo Clube - Dashboard'
            },
            {
                path: 'empresa',
                loadComponent: () => import('./pages/home/company/company').then(m => m.CompanyComponent),
                canActivate: [profilePermissionGuard],
                title: 'Selo Clube - Empresa',
                data: {
                    permissions: ['can_access_companies_menu']
                }
            },
            {
                path: 'empresa/adicionar',
                loadComponent: () => import('./pages/home/company/add-company/add-company').then(m => m.AddCompany),
                canActivate: [profilePermissionGuard],
                title: 'Selo Clube - Nova empresa',
                data: {
                    permissions: ['can_access_companies_menu']
                }
            },
            {
                path: 'usuarios',
                loadComponent: () => import('./pages/home/users/users').then(m => m.Users),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Usuários',
                data: {
                    permissions: ['can_access_users_menu']
                }
            },
            {
                path: 'usuarios/adicionar',
                loadComponent: () => import('./pages/home/add-edit-user/add-edit-user').then(m => m.AddEditUser),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Novo usuário',
                data: {
                    permissions: ['can_access_users_menu']
                }
            },
            {
                path: 'usuarios/editar/:id',
                loadComponent: () => import('./pages/home/add-edit-user/add-edit-user').then(m => m.AddEditUser),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Edição de usuário',
                data: {
                    permissions: ['can_access_users_menu']
                }
            },
            {
                path: 'campanhas',
                loadComponent: () => import('./pages/home/campaigns/campaigns').then(m => m.Campaigns),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Campanhas',
                data: {
                    permissions: ['can_access_campaign_menu']
                }
            },
            {
                path: 'campanhas/adicionar',
                loadComponent: () => import('./pages/home/add-edit-campaign/add-edit-campaign').then(m => m.AddEditCampaign),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Nova campanha',
                data: {
                    permissions: ['can_access_campaign_menu']
                }
            },
            {
                path: 'campanhas/editar/:id',
                loadComponent: () => import('./pages/home/add-edit-campaign/add-edit-campaign').then(m => m.AddEditCampaign),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Edição de campanha',
                data: {
                    permissions: ['can_access_campaign_menu']
                }
            },
            {
                path: 'clientes',
                loadComponent: () => import('./pages/home/clients/clients').then(m => m.Clients),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Clientes',
                data: {
                    permissions: ['can_access_customers_menu']
                }
            },
            {
                path: 'perfis',
                loadComponent: () => import('./pages/home/profiles/profiles').then(m => m.Profiles),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Perfis',
                data: {
                    permissions: ['can_access_profile_menu']
                }
            },
            {
                path: 'perfis/adicionar',
                loadComponent: () => import('./pages/home/add-edit-profile/add-edit-profile').then(m => m.AddEditProfile),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Novo perfil',
                data: {
                    permissions: ['can_access_profile_menu']
                }
            },
            {
                path: 'perfis/editar/:id',
                loadComponent: () => import('./pages/home/add-edit-profile/add-edit-profile').then(m => m.AddEditProfile),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Edição de perfil',
                data: {
                    permissions: ['can_access_profile_menu']
                }
            },
            {
                path: 'lancar-selo',
                loadComponent: () => import('./pages/home/register-stamp/register-stamp').then(m => m.RegisterStamp),
                canActivate: [profilePermissionGuard, CompanyRegisteredGuard],
                title: 'Selo Clube - Registrar selo',
                data: {
                    permissions: ['can_register_stamps']
                }
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
        ]
    },
    {
        path: 'user',
        loadComponent: () => import('./pages/user/user-page/user-page').then(m => m.UserPage),
        canActivate: [loggedUserGuard],
        children: [
            {
                path: 'dados',
                loadComponent: () => import('./pages/user/user-data/user-data').then(m => m.UserData),
                title: 'Selo Clube - Meus dados'
            },
            {
                path: 'trocar-senha',
                loadComponent: () => import('./pages/user/user-change-password/user-change-password').then(m => m.UserChangePassword),
                title: 'Selo Clube - Trocar senha'
            },
            {
                path: '',
                redirectTo: 'dados',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'aceitar-convite',
        loadComponent: () => import('./pages/accept-invitation/accept-invitation').then(m => m.AcceptInvitation),
        title: 'Selo Clube - Aceitar convite'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login),
        title: 'Selo Clube - Login'
    },
    {
        path: 'recuperar-senha',
        loadComponent: () => import('./pages/recover-password/recover-password').then(m => m.RecoverPassword),
        title: 'Selo Clube - Recuperar senha'
    },
    {
        path: 'resetar-senha',
        loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPassword),
        title: 'Selo Clube - Redefinir senha'
    },
    {
        path: '',
        loadComponent: () => import('./pages/site/site').then(m => m.Site),
        title: 'Selo Clube - Site'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
