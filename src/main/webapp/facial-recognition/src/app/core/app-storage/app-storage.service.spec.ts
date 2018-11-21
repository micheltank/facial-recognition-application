import { TestBed, inject } from '@angular/core/testing';

import { AppStorageService } from './app-storage.service';
import { UtilsService } from '@core/utils/utils.service';
import { WindowRefService } from '@core/window-ref/window-ref.service';

describe('AppStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowRefService, UtilsService, AppStorageService]
    });
  });

  it('should be created', inject(
    [AppStorageService],
    (service: AppStorageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
