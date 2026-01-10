import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import pt from '@angular/common/locales/pt';
import {
    ApplicationConfig,
    importProvidersFrom,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';

registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideNzI18n(pt_BR),
        importProvidersFrom(FormsModule),
        provideAnimationsAsync(),
        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
        { provide: NZ_CONFIG, useValue: { notification: { nzPlacement: 'bottomRight' } } },
        provideEnvironmentNgxMask()
    ]
};
