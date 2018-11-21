import { TestBed, inject } from '@angular/core/testing';

import { PendingRequestsService } from './pending-requests.service';

describe('PendingRequestsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PendingRequestsService]
    });
  });

  it('should be created', inject(
    [PendingRequestsService],
    (service: PendingRequestsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
