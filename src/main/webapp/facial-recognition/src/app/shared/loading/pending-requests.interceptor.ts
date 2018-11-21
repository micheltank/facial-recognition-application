import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PendingRequestsService } from '@shared/loading/pending-requests/pending-requests.service';

@Injectable()
export class PendingRequestsInterceptor implements HttpInterceptor {
  private pendingRequestsCounter = 0;

  constructor(private pendingRequestsService: PendingRequestsService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.pendingRequestsService.hasIgnoredUrls()) {
      const isIgnored = !!this.pendingRequestsService.ignoredUrls.find(
        urlPart => req.url.includes(urlPart)
      );
      if (isIgnored) {
        // se esta é uma url ignorada, nao controla
        return next.handle(req);
      }
    }

    this.pendingRequestsCounter++;
    this.pendingRequestsService.pendingRequest(this.pendingRequestsCounter);

    return next.handle(req).pipe(
      tap(
        evt => {
          if (evt instanceof HttpResponse) {
            this.pendingRequestsCounter--;
            this.pendingRequestsService.pendingRequest(
              this.pendingRequestsCounter
            );
          }
        },
        err => {
          this.pendingRequestsCounter--;
          this.pendingRequestsService.pendingRequest(
            this.pendingRequestsCounter
          );
        }
      )
    );
  }
}
