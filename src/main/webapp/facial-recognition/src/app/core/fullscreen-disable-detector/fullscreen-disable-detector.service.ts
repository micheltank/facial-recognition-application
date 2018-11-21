import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

declare const document: any;
@Injectable()
export class FullscreenDisableDetectorService implements OnDestroy {
  private fullscreenDisabledObservable: Observable<any>;
  private fullscreenSubscriber: Subscriber<any>;

  constructor() {}

  ngOnDestroy() {
    this.stop();
  }

  public start() {
    this.stop();
    this.fullscreenDisabledObservable = new Observable(subscriber => {
      this.fullscreenSubscriber = subscriber;
    });
    this.preventF11action();
    this.registerOnFullscreenCallback();
    setTimeout(() => {
      this.emitFullscreenState();
    });
  }

  public onFullscreenDisabled(): Observable<any> {
    return this.fullscreenDisabledObservable;
  }

  public stop() {
    this.restoreF11action();
    this.removeOnFullscreenCallback();
    if (this.fullscreenSubscriber) {
      this.fullscreenSubscriber.complete();
    }
    this.fullscreenDisabledObservable = undefined;
  }

  public requestFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    this.tryRotationScreen();
  }

  public tryRotationScreen() {
    try {
      const orientation = screen['orientation'];
      if (orientation !== undefined && orientation != null) {
        if (
          orientation['type'] !== 'landscape' &&
          orientation['type'] !== 'landscape-primary'
        ) {
          screen['orientation'].lock('landscape-primary');
        }
      }
    } catch (e) {
      console.log('Não é possível rotacionar a tela');
    }
  }

  public exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  private preventF11action() {
    document.onkeydown = (evt: KeyboardEvent) => {
      // previne que o fullscreen seja ativado via F11
      // muita dor de cabeça tratar o F11 ◔_◔
      if (evt.code === 'F11') {
        evt.preventDefault();
      }
    };
  }

  private restoreF11action() {
    document.onkeydown = undefined;
  }

  private registerOnFullscreenCallback() {
    document.onfullscreenchange = event => {
      this.emitFullscreenState(event);
    };

    document.onwebkitfullscreenchange = event => {
      this.emitFullscreenState(event);
    };

    document.onmozfullscreenchange = event => {
      this.emitFullscreenState(event);
    };

    document.MSFullscreenChange = event => {
      this.emitFullscreenState(event);
    };
  }

  private removeOnFullscreenCallback() {
    document.onfullscreenchange = undefined;
    document.onwebkitfullscreenchange = undefined;
    document.onmozfullscreenchange = undefined;
    document.MSFullscreenChange = undefined;
  }

  private emitFullscreenState(event?) {
    if (!this.isFullScreen()) {
      this.fullscreenSubscriber.next();
    }
  }

  private isFullScreen() {
    return !!document.webkitIsFullScreen || !!document.mozFullScreen;
  }
}
