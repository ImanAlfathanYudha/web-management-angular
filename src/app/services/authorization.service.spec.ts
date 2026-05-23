import { TestBed } from '@angular/core/testing';

import { AuthorizationServiceTs } from './authorization.service.js';

describe('AuthorizationServiceTs', () => {
  let service: AuthorizationServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
