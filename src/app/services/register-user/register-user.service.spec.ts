import { TestBed } from '@angular/core/testing';

import { RegisterUserService } from './register-user.service';

describe('RegisterUser', () => {
    let service: RegisterUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RegisterUserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
