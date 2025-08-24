import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { profilePermissionGuard } from './profile-permission-guard';

describe('profilePermissionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => profilePermissionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
