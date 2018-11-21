import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscriber } from 'rxjs';

@Injectable()
export class CameraService implements OnDestroy {
  private photoTaken: Observable<any>;
  private subscriber: Subscriber<any>;

  constructor() {
    this.photoTaken = new Observable<any>(subscriber => {
      this.subscriber = subscriber;
    });
  }

  ngOnDestroy() {
    this.subscriber.complete();
  }

  public takePhoto() {
    this.subscriber.next();
  }

  public onPhotoTaken(): Observable<any> {
    return this.photoTaken;
  }
}
