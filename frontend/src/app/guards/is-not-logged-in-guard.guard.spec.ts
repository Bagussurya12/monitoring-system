import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isNotLoggedInGuardGuard } from './is-not-logged-in-guard.guard';

describe('isNotLoggedInGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isNotLoggedInGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
