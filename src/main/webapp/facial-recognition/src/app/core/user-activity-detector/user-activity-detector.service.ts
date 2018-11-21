import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class UserActivityDetectorService implements OnDestroy {
  private activityTimer;
  private inactivityObservable: Observable<number>;
  private inactivitySubscriber: Subscriber<number>;
  private activityObservable: Observable<any>;
  private activitySubscriber: Subscriber<any>;
  private isPaused: boolean;

  constructor() {}

  ngOnDestroy() {
    this.stop();
  }

  public start(inactivityTreshold = 20000) {
    this.stop();
    this.inactivityObservable = new Observable(subscriber => {
      this.inactivitySubscriber = subscriber;
    });

    this.activityObservable = new Observable(subscriber => {
      this.activitySubscriber = subscriber;
    });
    this.registerEventListeners(inactivityTreshold);
  }

  public stop() {
    this.removeEventListeners();
    if (this.inactivitySubscriber) {
      this.inactivitySubscriber.complete();
    }
    this.inactivityObservable = undefined;
    this.inactivitySubscriber = undefined;

    if (this.activitySubscriber) {
      this.activitySubscriber.complete();
    }
    this.activityObservable = undefined;
    this.activitySubscriber = undefined;
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
  }

  public onInactivity(): Observable<any> {
    return this.inactivityObservable;
  }

  public onActivity(): Observable<any> {
    return this.activityObservable;
  }

  private registerEventListeners(inactivityTreshold: number) {
    document.onkeydown = (evt: KeyboardEvent) => {
      this.userActivityCallback(evt, inactivityTreshold);
    };
    document.onmousedown = (evt: MouseEvent) => {
      this.userActivityCallback(evt, inactivityTreshold);
    };
    document.onmousemove = (evt: MouseEvent) => {
      this.userActivityCallback(evt, inactivityTreshold);
    };
    document.ontouchstart = (evt: TouchEvent) => {
      this.userActivityCallback(evt, inactivityTreshold);
    };
    document.ontouchmove = (evt: TouchEvent) => {
      this.userActivityCallback(evt, inactivityTreshold);
    };
    document.addEventListener('virtualkeyboardevent', (evt: MouseEvent) => {
      this.userActivityCallback(evt, inactivityTreshold);
    });
  }

  private userActivityCallback(evt: Event, inactivityTreshold: number) {
    this.activitySubscriber.next(evt);
    clearTimeout(this.activityTimer);
    this.createActivityTimer(inactivityTreshold);
  }

  private removeEventListeners() {
    document.onkeydown = undefined;
    document.onmousemove = undefined;
    document.onmousedown = undefined;
  }

  private createActivityTimer(inactivityTreshold: number) {
    this.activityTimer = setTimeout(() => {
      if (!this.isPaused) {
        this.inactivitySubscriber.next(inactivityTreshold);
      }
    }, inactivityTreshold);
  }
}
