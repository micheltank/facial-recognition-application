import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BackendService } from './backend.service';
import { UtilsService } from '@core/utils/utils.service';
import { WindowRefService } from '@core/window-ref/window-ref.service';
import { AppProprietiesService } from '@core/app-proprieties/app-proprieties.service';
import { AppStorageService } from '@core/app-storage/app-storage.service';

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WindowRefService,
        UtilsService,
        BackendService,
        AppProprietiesService,
        AppStorageService
      ]
    });
  });

  it('should be created', inject(
    [BackendService],
    (service: BackendService) => {
      expect(service).toBeTruthy();
    }
  ));
});
