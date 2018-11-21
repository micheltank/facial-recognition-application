import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Terminal } from '@core/model/terminal';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';
import { Observable, of, EMPTY } from 'rxjs';
import { AuthCredentials } from '@core/model/auth-credentials';
import { AuthToken } from '@core/model/auth-token';
import { Person } from '@core/model/person';
import { ProvisoryCredential } from '@core/model/provisory-credential';
import { ProvisoryCredentialReason } from '@core/model/provisory-credential-reason';
import { Photo } from '@core/model/photo';
import { FeedbackPollAnswer } from '@core/model/feedback-question';
import { User } from '@core/model/user';
import { UtilsService } from '@core/utils/utils.service';
import { Schedule } from '@core/model/schedule';
import { DocumentType } from '@core/model/document-type';
import { AppProprietiesService } from '@core/app-proprieties/app-proprieties.service';
import { TagModelType } from '@core/enums/tag-model-type';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { TagPrintingConfigs } from '@core/model/tag-printing-configs';
import { TerminalManufacturer } from '@core/enums/terminal-manufacturer';

@Injectable()
export class BackendService {
  private static readonly DEFAULT_FACIAL_RECOGNITION_PERCENTAGE = 80;

  public endpoints = {
    login: `${environment.urlBackend}/login`,
    terminals: `${environment.urlBackend}/selfserviceterminal`,
    terminal: id => `${environment.urlBackend}/selfserviceterminal/${id}`,
    scheduleByPeople: `${environment.urlBackend}/scheduling/people`,
    scheduleByLocator: (locator, terminalId) =>
      `${
        environment.urlBackend
      }/scheduling/locator/${locator}?terminal=${terminalId}`,
    scheduleByDocument: (locator, documentTypeId, terminalId) =>
      `${
        environment.urlBackend
      }/scheduling/document/${locator}?terminal=${terminalId}&documentTypeId=${documentTypeId}`,
    personByDocument: (document, documentType, terminalId) =>
      `${
        environment.urlBackend
      }/person/document/${document}?terminal=${terminalId}&documentTypeId=${documentType}`,
    personByUserAndPass: terminalId =>
      `${environment.urlBackend}/person/user?terminal=${terminalId}`,
    selectTerminal: `${environment.urlBackend}/selfserviceterminal/select`,
    credentialDeliveryByPerson: personId =>
      `${environment.urlBackend}/credential/delivery/person/${personId}`,
    reasons: `${environment.urlBackend}/credential/provisory/reasons`,
    documentTypes: terminalId =>
      `${environment.urlBackend}/documenttype/required?terminal=${terminalId}`,
    getPersonPhoto: personId =>
      `${environment.urlBackend}/person/${personId}/photo`,
    postPersonPhoto: `${environment.urlBackend}/person/photo`,
    feedbackPoll: `${environment.urlBackend}/feedbackpoll/result`,
    credentialScheduledDelivery: schedulingId =>
      `${
        environment.urlBackend
      }/credential/delivery/scheduling/${schedulingId}`,
    peopleIdsByFaceRecognition: similarity =>
      `${environment.urlBackend}/recognition/facematch/${similarity}`,
    verifyPersonByfaceRecognition: (similarity, personId) =>
      `${
        environment.urlBackend
      }/recognition/faceverification/${similarity}/${personId}`,

    printTag: `${environment.urlBackend}/tag/print`,
    credentialDeliveryBySchedule: (scheduleId: number) =>
      `${environment.urlBackend}/credential/delivery/scheduling/${scheduleId}`
  };

  constructor(
    public httpClient: HttpClient,
    private utilsService: UtilsService,
    private propsService: AppProprietiesService,
    private storageService: AppStorageService
  ) {}

  public getPrintableTag(
    tagModelType: TagModelType,
    isFromSchedule: boolean
  ): Observable<string> {
    const terminal = this.storageService.getActiveTerminal();
    if (
      !terminal ||
      terminal.manufacturer !== TerminalManufacturer.ACESSO_REMOTO
    ) {
      return EMPTY;
    }
    const schedule = this.storageService.getActiveSchedule();
    const scheduleRoleId = schedule ? schedule.role.id : undefined;
    const visited = schedule ? schedule.visitedPerson : undefined;
    const selfServiceterminalId = terminal.id;
    const person = this.storageService.getActivePerson();

    let credentialSource: Observable<ProvisoryCredential>;
    let params = new HttpParams().set('terminal', `${selfServiceterminalId}`);
    if (isFromSchedule) {
      credentialSource = this.httpClient
        .post(
          this.endpoints.credentialDeliveryBySchedule(schedule.id),
          undefined,
          {
            params
          }
        )
        .pipe(
          map(val => Object.assign(Object.create(ProvisoryCredential), val))
        );
    } else {
      const reason = this.storageService.getActiveReason();
      if (reason) {
        params = params.set('reason', `${reason.id}`);
      }
      credentialSource = this.httpClient
        .post(this.endpoints.credentialDeliveryByPerson(person.id), undefined, {
          params
        })
        .pipe(
          map(val => Object.assign(Object.create(ProvisoryCredential), val))
        );
    }

    return credentialSource.pipe(
      flatMap(credential => {
        const cardNumber = credential.cardCredentialList[0].cardNumber;
        const tagConfigs = {
          tagModelType,
          selfServiceterminalId,
          person,
          cardNumber,
          visitorRoleId: scheduleRoleId, // backend utilizou um nome errado (visitorRoleId)
          visited
        } as TagPrintingConfigs;
        return this.httpClient.post(this.endpoints.printTag, tagConfigs, {
          responseType: 'text'
        });
      })
    );
  }

  public getPhoto(person: Person): Observable<Photo> {
    return this.httpClient
      .get(this.endpoints.getPersonPhoto(person.id))
      .pipe(map(e => Object.assign(Object.create(Photo.prototype), e)));
  }

  public postPhoto(person: Person, photo: string) {
    const blob = this.utilsService.dataURItoBlob(photo) as any;
    const blobFileName = new Date().getTime() + '.png';
    const fd = new FormData();
    fd.append('file', blob, blobFileName);
    fd.append('person', JSON.stringify(person));
    return this.httpClient.post(this.endpoints.postPersonPhoto, fd);
  }

  public verifyPersonByFaceRecognition(
    photo: string,
    personId: number
  ): Observable<boolean> {
    const blob = this.utilsService.dataURItoBlob(photo) as any;
    const blobFileName = new Date().getTime() + '.png';
    const fd = new FormData();
    fd.append('file', blob, blobFileName);

    const activeTerminal = this.storageService.getActiveTerminal();

    const similarity =
      this.propsService.getTerminalProperties().photoConferencePercentage ||
      BackendService.DEFAULT_FACIAL_RECOGNITION_PERCENTAGE;

    const source = this.httpClient.post(
      this.endpoints.verifyPersonByfaceRecognition(similarity, personId),
      fd
    );

    return source.pipe(
      map((matched: any) => {
        const matchedSimilarity =
          matched && matched.similarity ? matched.similarity : 0;
        if (
          matchedSimilarity >=
          activeTerminal.propertySelfServiceTerminal.photoConferencePercentage
        ) {
          return true;
        }
        return false;
      })
    );
  }

  public getScheduleByFacialRecognition(
    photo: string,
    terminalId: number
  ): Observable<Schedule> {
    const blob = this.utilsService.dataURItoBlob(photo) as any;
    const blobFileName = new Date().getTime() + '.png';
    const fd = new FormData();
    fd.append('file', blob, blobFileName);

    const similarity =
      this.propsService.getTerminalProperties().photoConferencePercentage ||
      BackendService.DEFAULT_FACIAL_RECOGNITION_PERCENTAGE;

    const source = this.httpClient.post(
      this.endpoints.peopleIdsByFaceRecognition(similarity),
      fd
    );

    return source.pipe(
      flatMap((matches: any[]) => {
        if (!matches || !matches.length) {
          return of([] as Schedule[]);
        }
        const mostSimilarPerson = matches.sort(
          (a, b) => b.similarity - a.similarity
        )[0];
        const delta = 3;
        const equalPeople = matches
          .filter(
            person => person.similarity >= mostSimilarPerson.similarity - delta
          )
          .map(person => person.personId);
        return this.getScheduleByPeopleId(equalPeople, terminalId);
      })
    );
  }

  public getReasons(): Observable<ProvisoryCredentialReason[]> {
    return this.httpClient
      .get(this.endpoints.reasons)
      .pipe(
        map((reasonsJson: any[]) =>
          reasonsJson.map(e =>
            Object.assign(Object.create(ProvisoryCredentialReason.prototype), e)
          )
        )
      );
  }

  public getDocumentTypes(terminalId): Observable<DocumentType[]> {
    return this.httpClient
      .get(this.endpoints.documentTypes(terminalId))
      .pipe(
        map((types: any[]) =>
          types.map(e =>
            Object.assign(Object.create(DocumentType.prototype), e)
          )
        )
      );
  }

  public credentialDelivery(
    personId: number,
    terminalId,
    language,
    reason?
  ): Observable<ProvisoryCredential[]> {
    let params = new HttpParams()
      .set('language', `${language}`)
      .set('terminal', `${terminalId}`);

    if (reason) {
      params = params.set('reason', `${reason.id}`);
    }
    return this.httpClient
      .post(this.endpoints.credentialDeliveryByPerson(personId), null, {
        params
      })
      .pipe(
        map((json: any[]) =>
          Object.assign(Object.create(ProvisoryCredential.prototype), json)
        )
      );
  }

  public credentialScheduledDelivery(
    schedulingId: number,
    terminalId,
    language
  ): Observable<ProvisoryCredential[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('terminal', terminalId);
    queryParams = queryParams.append('language', language);
    return this.httpClient
      .post(this.endpoints.credentialScheduledDelivery(schedulingId), null, {
        params: queryParams
      })
      .pipe(
        map((json: any[]) =>
          Object.assign(Object.create(ProvisoryCredential.prototype), json)
        )
      );
  }

  public getTerminals(status = 0): Observable<Terminal[]> {
    const params = new HttpParams().set('status', `${status}`);
    return this.httpClient
      .get(this.endpoints.terminals, { params })
      .pipe(
        map((terminalsJson: any[]) =>
          terminalsJson.map(e =>
            Object.assign(Object.create(Terminal.prototype), e)
          )
        )
      );
  }

  public getTerminal(id: number): Observable<Terminal> {
    return this.httpClient
      .get(this.endpoints.terminal(id))
      .pipe(
        map(json => Object.assign(Object.create(Terminal.prototype), json))
      );
  }

  public logIn(credentials: AuthCredentials): Observable<AuthToken> {
    return this.httpClient
      .post(this.endpoints.login, credentials)
      .pipe(
        map(json => Object.assign(Object.create(AuthToken.prototype), json))
      );
  }

  public getPersonByDocument(
    document: string,
    documentType: number,
    terminalId: number
  ): Observable<Person> {
    return this.httpClient
      .get(this.endpoints.personByDocument(document, documentType, terminalId))
      .pipe(map(json => Object.assign(Object.create(Person.prototype), json)));
  }

  public getScheduleByPeopleId(
    peopleId: number[],
    terminalId: number
  ): Observable<Schedule> {
    return this.httpClient
      .post(this.endpoints.scheduleByPeople, {
        people: peopleId,
        terminal: terminalId
      })
      .pipe(
        map((json: any[]) => {
          if (!json) {
            return {} as Schedule;
          }
          const schedules = json.map(e =>
            Object.assign(Object.create(Schedule.prototype), e)
          ) as Schedule[];
          if (schedules.length > 1) {
            const schedulesOfMostSimilar = schedules.filter(
              schedule => schedule.person.id === peopleId[0]
            );
            if (schedulesOfMostSimilar.length > 1) {
              // Se tiver mais de um schedule ativo é porque tem algo de errado..
              // Pois existem dois ou mais agendamento no mesmo momento para mesma pessoa
              return {} as Schedule;
            } else {
              // Retorna schedule da pessoa que tem maior grau de semelhança
              return schedulesOfMostSimilar[0];
            }
          }
          return schedules[0];
        })
      );
  }

  public getScheduleByLocator(locator: string): Observable<Schedule> {
    const terminal = this.storageService.getActiveTerminal();
    return this.httpClient
      .get(
        this.endpoints.scheduleByLocator(locator, terminal ? terminal.id : 0)
      )
      .pipe(
        map(json => Object.assign(Object.create(Schedule.prototype), json))
      );
  }

  public getScheduleByDocument(
    locator: string,
    documentTypeId: number,
    terminalId: number
  ): Observable<Schedule> {
    return this.httpClient
      .get(
        this.endpoints.scheduleByDocument(locator, documentTypeId, terminalId)
      )
      .pipe(
        map(json => Object.assign(Object.create(Schedule.prototype), json))
      );
  }

  public getPersonByUserAndPass(
    credentials: User,
    terminalId: number
  ): Observable<Person> {
    return this.httpClient
      .post(this.endpoints.personByUserAndPass(terminalId), credentials)
      .pipe(map(json => Object.assign(Object.create(Person.prototype), json)));
  }

  public selectTerminal(terminal: Terminal): Observable<any> {
    return this.httpClient.post(this.endpoints.selectTerminal, terminal);
  }

  public sendFeedbackPoll(feedback: FeedbackPollAnswer) {
    return this.httpClient.post(this.endpoints.feedbackPoll, feedback);
  }
}
