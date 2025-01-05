import { TestBed } from '@angular/core/testing';

import { FilterDataService } from './filter-data.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FilterDataService', () => {
  let service: FilterDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FilterDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
