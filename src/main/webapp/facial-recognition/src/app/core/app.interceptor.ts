import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppEventsService } from './app-events/app-events.service';
import { BackendService } from '@core/backend/backend.service';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { environment } from '@environment/environment';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(
    public appEventsService: AppEventsService,
    public backendService: BackendService,
    public appStorageService: AppStorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = this.addAuthTokenHeader(req);

    return next.handle(req).pipe(
      tap(
        evt => {},
        err => {
          this.handleErrors(err);
        }
      )
    );
  }

  private addAuthTokenHeader(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.appStorageService.getAuthToken();
    if (token) {
      return req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    } else {
      return req;
    }
  }

  private handleErrors(err) {
    if (err instanceof HttpErrorResponse) {
      if (err.status >= 400 && err.status < 500) {
        this.handle4xxErrors(err);
      } else if (err.status >= 500) {
        this.handle5xxErrors(err);
      } else if (err.status === 0) {
        this.handleGenericErrors(err);
      }
    }
  }

  private handle5xxErrors(res) {
    this.appEventsService.onNetworkError5xx().emit(res);
  }

  private handle4xxErrors(res) {
    this.appEventsService.onNetworkError4xx().emit(res);
  }

  private handleGenericErrors(res) {
    this.appEventsService.onGenericNetworkError().emit(res);
  }
}
