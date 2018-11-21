import { Injectable } from '@angular/core';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { TerminalManufacturer } from '@core/enums/terminal-manufacturer';

@Injectable({
  providedIn: 'root'
})
export class VirtualKeyboardService {
  constructor(private storageService: AppStorageService) {}

  public shouldShowVirtualKeyboard(): boolean {
    const terminal = this.storageService.getActiveTerminal();
    const manufacturer =
      terminal && terminal.manufacturer ? terminal.manufacturer : undefined;

    if (manufacturer) {
      return (
        manufacturer === TerminalManufacturer.DIGICON ||
        manufacturer === TerminalManufacturer.VIDEOSOFT
      );
    } else {
      return false;
    }
  }
}
