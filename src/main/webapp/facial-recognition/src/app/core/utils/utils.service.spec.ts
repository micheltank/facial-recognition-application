import { TestBed, inject } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { WindowRefService } from '@core/window-ref/window-ref.service';

describe('UtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowRefService, UtilsService]
    });
  });

  it('should be created', inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));
});
