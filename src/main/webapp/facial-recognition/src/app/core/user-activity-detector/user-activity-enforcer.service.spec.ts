import { TestBed, inject } from '@angular/core/testing';

import { UserActivityDetectorService } from './user-activity-detector.service';

describe('UserActivityDetectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserActivityDetectorService]
    });
  });

  it('should be created', inject(
    [UserActivityDetectorService],
    (service: UserActivityDetectorService) => {
      expect(service).toBeTruthy();
    }
  ));
});
