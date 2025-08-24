import { TestBed } from '@angular/core/testing';

import { StampQRService } from './stamp-qr.service';

describe('StampQRService', () => {
    let service: StampQRService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StampQRService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
