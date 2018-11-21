import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingRequestsService {
  private pendingRequestsEvent = new EventEmitter<number>();
  private _ignoredUrls = [];

  constructor() {}

  public pendingRequest(numOfPendingReqs: number) {
    return this.pendingRequestsEvent.emit(numOfPendingReqs);
  }

  public onPendingRequest(): Observable<number> {
    return this.pendingRequestsEvent.asObservable();
  }

  public addIgnoredUrls(urlPart: string) {
    this._ignoredUrls.push(urlPart);
  }

  get ignoredUrls() {
    return this._ignoredUrls;
  }

  public hasIgnoredUrls(): boolean {
    return this._ignoredUrls.length > 0;
  }
}
