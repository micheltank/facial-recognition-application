import { TestBed, inject } from '@angular/core/testing';

import { FullscreenDisableDetectorService } from './fullscreen-disable-detector.service';

describe('FullscreenDisasbleDetectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FullscreenDisableDetectorService]
    });
  });

  it('should be created', inject(
    [FullscreenDisableDetectorService],
    (service: FullscreenDisableDetectorService) => {
      expect(service).toBeTruthy();
    }
  ));
});
