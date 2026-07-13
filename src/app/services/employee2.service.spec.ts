import { TestBed } from '@angular/core/testing';

import { Employee2 } from './employee2';

describe('Employee2', () => {
  let service: Employee2;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Employee2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
