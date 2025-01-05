/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { OnlineTestService } from './online-test.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Service: OnlineTest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OnlineTestService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should ...', inject([OnlineTestService], (service: OnlineTestService) => {
    expect(service).toBeTruthy();
  }));
});
