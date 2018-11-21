import { Injectable } from '@angular/core';
import { WindowRefService } from '@core/window-ref/window-ref.service';

declare function unescape(s: string): string;
@Injectable()
export class UtilsService {
  constructor(private windowRef: WindowRefService) {}

  public dataURItoBlob(dataURI) {
    let byteString: any = {};
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    const array = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      array[i] = byteString.charCodeAt(i);
    }
    return new Blob([array], {
      type: mimeString
    });
  }

  public documentLoaded(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        this.windowRef.native().onload = () => resolve();
      }
    });
  }

  public setColorTheme(color: string) {
    this.documentLoaded().then(() => {
      document.body.style.setProperty('--color-theme', color);
      const rgbColorObj = this.hexToRgb(color);
      const rgbColor = `${rgbColorObj.r}, ${rgbColorObj.g}, ${rgbColorObj.b}`;
      document.body.style.setProperty('--color-theme-rgb', rgbColor);
    });
  }

  private hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  public isArrayEmpty(arr: Array<any>) {
    return !arr || arr.length === 0;
  }

  public getEmptyImageDataUrl(): string {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  public daysToMillis(numOfDays: number): number {
    return numOfDays * 24 /*d=>h*/ * 60 /*h=>m*/ * 60 /*m=>s*/ * 1000 /*s=>ms*/;
  }
}
