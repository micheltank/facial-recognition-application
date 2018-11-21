import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private nextPageObserver: Observer<any>;
  private nextPageObservable = Observable.create(observer => {
    this.nextPageObserver = observer;
  });

  constructor() {}

  public onNextPage(): Observable<any> {
    return this.nextPageObservable;
  }

  public nextPage(): void {
    if (!this.nextPageObserver) {
      return;
    }
    this.nextPageObserver.next(true);
  }
}
