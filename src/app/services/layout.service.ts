import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
    private _mobileMenuOpen = new BehaviorSubject<boolean>(false);
    mobileMenuOpen$ = this._mobileMenuOpen.asObservable();

    setMobileMenuOpen(open: boolean) {
        this._mobileMenuOpen.next(open);
    }

    toggleMobileMenu() {
        this._mobileMenuOpen.next(!this._mobileMenuOpen.value);
    }
}
