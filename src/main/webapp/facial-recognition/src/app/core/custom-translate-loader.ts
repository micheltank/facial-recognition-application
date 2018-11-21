import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Language } from '@core/enums/language.enum';
import { AppProprietiesService } from '@core/app-proprieties/app-proprieties.service';

@Injectable()
export class CustomTranslateLoader implements TranslateLoader {
  constructor(
    private httpClient: HttpClient,
    private appPropsService: AppProprietiesService
  ) {}

  getTranslation(lang: string): Observable<any> {
    const propertySelfServiceTerminal = this.appPropsService.getTerminalProperties();
    let languageLink = '';

    if (lang && propertySelfServiceTerminal) {
      switch (lang) {
        case Language.BRAZILIAN_PORTUGUESE + Language.CUSTOM_SUFFIX:
          languageLink = propertySelfServiceTerminal.ptbrDictionaryFileUrl;
          break;
        case Language.ENGLISH + Language.CUSTOM_SUFFIX:
          languageLink = propertySelfServiceTerminal.enDictionaryFileUrl;
          break;
        case Language.SPANISH + Language.CUSTOM_SUFFIX:
          languageLink = propertySelfServiceTerminal.esDictionaryFileUrl;
          break;
        default:
          // se não achou, na chamada abaixo busca o fallback
          break;
      }
    } else {
      lang = Language.BRAZILIAN_PORTUGUESE + Language.CUSTOM_SUFFIX;
    }

    return Observable.create(observer => {
      const langWithoutSuffix = lang.replace(Language.CUSTOM_SUFFIX, '');
      forkJoin(
        this.httpClient
          .get(`${languageLink}?time=${Date.now()}`)
          .pipe(catchError(() => of({}))),
        this.httpClient
          .get('/assets/i18n/' + langWithoutSuffix + '.json')
          .pipe(catchError(() => of({}))),
        this.httpClient
          .get('/assets/i18n/static-strings/' + langWithoutSuffix + '.json')
          .pipe(catchError(() => of({})))
      ).subscribe(res => {
        const customTranslation = res[0];
        const staticTranslation = res[2];
        const translation =
          Object.keys(customTranslation).length !== 0
            ? customTranslation
            : res[1];
        observer.next({ ...translation, ...staticTranslation });
        observer.complete();
      });
    });
  }
}
