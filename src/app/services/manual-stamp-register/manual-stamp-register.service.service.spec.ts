import { TestBed } from '@angular/core/testing';

import { ManualStampRegisterServiceService } from './manual-stamp-register.service.service';

describe('ManualStampRegisterServiceService', () => {
  let service: ManualStampRegisterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManualStampRegisterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
