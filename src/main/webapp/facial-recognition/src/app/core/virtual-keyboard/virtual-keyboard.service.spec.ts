import { TestBed, inject } from '@angular/core/testing';

import { VirtualKeyboardService } from './virtual-keyboard.service';
import { CoreModule } from '@core/core.module';

describe('VirtualKeyboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule],
      providers: [VirtualKeyboardService]
    });
  });

  it('should be created', inject(
    [VirtualKeyboardService],
    (service: VirtualKeyboardService) => {
      expect(service).toBeTruthy();
    }
  ));
});
