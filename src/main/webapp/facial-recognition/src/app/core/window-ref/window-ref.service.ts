import { Injectable } from '@angular/core';

function _window(): any {
  return window;
}

@Injectable()
export class WindowRefService {
  constructor() {}

  native(): Window {
    return _window();
  }
}
