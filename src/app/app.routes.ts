import { Routes } from '@angular/router';

import { loggedUserGuard } from './guards/logged-user/logged-user-guard';

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

        ]
    },
    {
        path: 'usuario',
        loadComponent: () => import('./pages/user/user-page/user-page').then(m => m.UserPage),
        canActivate: [loggedUserGuard],
        children: [
            {
                path: 'dados',
                loadComponent: () => import('./pages/user/user-data/user-data').then(m => m.UserData),
                data: { animation: 'user-dados' },
                title: 'Selo Clube - Meus dados'
            },
            {
                path: 'trocar-senha',
                loadComponent: () => import('./pages/user/user-change-password/user-change-password').then(m => m.UserChangePassword),
                data: { animation: 'user-trocar-senha' },
                title: 'Selo Clube - Trocar senha'
            },
            {
                path: 'imagem-perfil',
                loadComponent: () => import('./pages/user/user-change-avatar/user-change-avatar').then(m => m.UserChangeAvatar),
                data: { animation: 'user-imagem-perfil' },
                title: 'Selo Clube - Alterar imagem de perfil'
            },
            {
                path: '',
                redirectTo: 'dados',
                pathMatch: 'full'
            }
        ]
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
        path: 'selecionar-cidade',
        loadComponent: () => import('./pages/select-city/select-city').then(m => m.SelectCity),
        canActivate: [loggedUserGuard],
        title: 'Selo Clube - Selecionar cidade'
    },
    {
        path: 'meus-selos/:id',
        loadComponent: () => import('./pages/my-stamps/my-stamps').then(m => m.MyStamps),
        canActivate: [loggedUserGuard],
        title: 'Selo Clube - Meus Selos'
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
