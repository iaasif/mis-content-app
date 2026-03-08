import { TestBed } from '@angular/core/testing';

import { MisApi } from './mis-api';

describe('MisApi', () => {
  let service: MisApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MisApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
