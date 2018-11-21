import { TestBed, inject } from '@angular/core/testing';

import { FaceObjectDetectService } from './face-object-detect.service';
import { WindowRefService } from '@core/window-ref/window-ref.service';

describe('FaceObjectDetectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowRefService, FaceObjectDetectService]
    });
  });

  it('should be created', inject(
    [FaceObjectDetectService],
    (service: FaceObjectDetectService) => {
      expect(service).toBeTruthy();
    }
  ));
});
