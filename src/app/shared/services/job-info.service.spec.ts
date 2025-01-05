import { TestBed } from '@angular/core/testing';

import { JobInfoService } from './job-info.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('JobInfoService', () => {
  let service: JobInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(JobInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
