/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { TestScheduleService } from './test-schedule.service';

describe('Service: TestSchedule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestScheduleService],
    });
  });

  it('should ...', inject(
    [TestScheduleService],
    (service: TestScheduleService) => {
      expect(service).toBeTruthy();
    }
  ));
});
