import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient
} from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';
import { appInitializer } from './app-initializer';
import { AppInterceptor } from '@core/app.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { BackendService } from '@core/backend/backend.service';
import { PendingRequestsInterceptor } from '@shared/loading/pending-requests.interceptor';
import { PendingRequestsService } from '@shared/loading/pending-requests/pending-requests.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [HttpClient, BackendService, AppStorageService]
    },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PendingRequestsInterceptor,
      multi: true
    },
    PendingRequestsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
