import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AppEventsService {
  private networkError5xxEvent = new EventEmitter();
  private networkError4xxEvent = new EventEmitter();
  private genericNetworkErrorEvent = new EventEmitter();

  constructor() {}

  public onNetworkError5xx() {
    return this.networkError5xxEvent;
  }

  public onNetworkError4xx() {
    return this.networkError4xxEvent;
  }

  public onGenericNetworkError() {
    return this.genericNetworkErrorEvent;
  }
}
