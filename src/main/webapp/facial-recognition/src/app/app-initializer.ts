import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable, forkJoin } from 'rxjs';

export function appInitializer(
  storageService: AppStorageService,
  httpClient: HttpClient
) {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {
      forkJoin(loadSomeInitLogic(httpClient, storageService, reject)).subscribe(
        () => {
          resolve();
        }
      );
    });
  };
}

function loadSomeInitLogic(
  httpClient: HttpClient,
  storageService: AppStorageService,
  reject
): Observable<any> {
  return new Observable(subs => {
    subs.next();
    subs.complete();
    // httpClient.get(endpoints.preferences).subscribe(
    //   permissions => {
    //     storageService.setUserPreferences(permissions);
    //     subs.next();
    //     subs.complete();
    //   },
    //   err => reject()
    // );
  });
}
