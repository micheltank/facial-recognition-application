import { TestBed, inject } from '@angular/core/testing';

import { CanvasUtilsService } from './canvas-utils.service';
import { WindowRefService } from '@core/window-ref/window-ref.service';

describe('CanvasUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowRefService, CanvasUtilsService]
    });
  });

  it('should be created', inject(
    [CanvasUtilsService],
    (service: CanvasUtilsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
