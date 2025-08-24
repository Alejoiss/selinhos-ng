import { TestBed } from '@angular/core/testing';

import { Plan } from './plan.service';

describe('Plan', () => {
    let service: Plan;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(Plan);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
