import { Injectable } from '@angular/core';
import { Terminal } from '@core/model/terminal';
import { AuthToken } from '@core/model/auth-token';
import { Person } from '@core/model/person';
import { ProvisoryCredentialReason } from '@core/model/provisory-credential-reason';
import { DocumentType } from '@core/model/document-type';
import { Schedule } from '@core/model/schedule';
import { EntryType } from '@core/enums/entry-type.enum';
import { UtilsService } from '@core/utils/utils.service';
import { TimelineSteps } from '@core/enums/timeline-steps.enum';
import { Photo } from '@core/model/photo';

@Injectable()
export class AppStorageService {
  private cacheData = {};
  private appkey = 'br.com.senior.sam.totem';
  private storageKeys = {
    availabelTerminalsKey: `${this.appkey}.terminals`,
    activeTerminalKey: `${this.appkey}.active-terminal`,
    authTokenKey: `${this.appkey}.auth-token`,
    activePersonKey: `${this.appkey}.active-person`,
    activeReasonKey: `${this.appkey}.active-reason`,
    availableReasonsKey: `${this.appkey}.available-reasons`,
    availableDocumentTypesKey: `${this.appkey}.available-document-types`,
    activeDocumentTypeKey: `${this.appkey}.active-document-type`,
    activeScheduleKey: `${this.appkey}.active-schedule`,
    activeEntryTypeKey: `${this.appkey}.active-entry-type`,
    photoTakenKey: `${this.appkey}.photo-taken`
  };

  constructor(private utilsService: UtilsService) {}

  public setActiveTerminal(terminal: Terminal) {
    localStorage.setItem(
      this.storageKeys.activeTerminalKey,
      JSON.stringify(terminal)
    );
  }

  public getActiveTerminal(): Terminal {
    const cached = this.getFromCache(this.storageKeys.activeTerminalKey);
    const cacheOrStorage =
      cached || localStorage.getItem(this.storageKeys.activeTerminalKey);
    const ret =
      cacheOrStorage && !cached
        ? Object.assign(
            Object.create(Terminal.prototype),
            JSON.parse(cacheOrStorage)
          )
        : undefined;

    this.cacheData[this.storageKeys.activeTerminalKey] = ret;
    return ret;
  }

  public setActiveEntryType(typeOfEntry: EntryType) {
    localStorage.setItem(
      this.storageKeys.activeEntryTypeKey,
      JSON.stringify(typeOfEntry)
    );
  }

  public getActiveEntryType(): EntryType {
    const cached = this.getFromCache(this.storageKeys.activeEntryTypeKey);
    const cacheOrStorage =
      cached || localStorage.getItem(this.storageKeys.activeEntryTypeKey);
    const ret =
      cacheOrStorage && !cached
        ? (JSON.parse(cacheOrStorage) as EntryType)
        : undefined;
    this.cacheData[this.storageKeys.activeEntryTypeKey] = ret;
    return ret;
  }

  public shouldCallCredentialDeliveryForNonScheduledVisit(currentStep) {
    const activeTerminalProperties = this.getActiveTerminal()
      .propertySelfServiceTerminal;
    const activePersonShouldTakeSurvey = this.getActivePerson().takeSurvey;
    const hasAcceptTermsStep =
      activeTerminalProperties.termOfAgreeForProvisoryCard;
    const hasSurveyStep =
      activeTerminalProperties.feedbackPoll &&
      activeTerminalProperties.feedbackPollQuestionForProvisoryCard.question
        .id !== 0;

    switch (currentStep) {
      case TimelineSteps.Survey:
        // é a última tela possível, se chegou até aqui deve entregar a credencial
        return true;
      case TimelineSteps.Orientation:
        // se ainda tiver a tela de pesquisa pela frente, a entrega da credencial deve ser feita lá
        return !(hasSurveyStep && activePersonShouldTakeSurvey);
      case TimelineSteps.Confirmation:
        // se tem a tela de pesquisa ou a de termos de aceite pela frente, a entrega deve ser feita na última delas
        return !(
          (hasSurveyStep && activePersonShouldTakeSurvey) ||
          hasAcceptTermsStep
        );
      default:
        console.error('flow not implemented yet');
        return false;
    }
  }

  public setActiveSchedule(schedule: Schedule) {
    localStorage.setItem(
      this.storageKeys.activeScheduleKey,
      JSON.stringify(schedule)
    );
    localStorage.setItem(
      this.storageKeys.activePersonKey,
      JSON.stringify(schedule.person)
    );
  }

  public getActiveSchedule(): Schedule {
    const cached = this.getFromCache(this.storageKeys.activeScheduleKey);
    const cacheOrStorage =
      cached || localStorage.getItem(this.storageKeys.activeScheduleKey);
    const ret =
      cacheOrStorage && !cached
        ? Object.assign(
            Object.create(Schedule.prototype),
            JSON.parse(cacheOrStorage)
          )
        : undefined;
    this.cacheData[this.storageKeys.activeScheduleKey] = ret;
    return ret;
  }

  public setTerminals(terminals: Terminal[]) {
    localStorage.setItem(
      this.storageKeys.availabelTerminalsKey,
      JSON.stringify(terminals)
    );
  }

  public getTerminals(): Terminal[] {
    const cached = this.getFromCache(this.storageKeys.availabelTerminalsKey);
    const res =
      cached || localStorage.getItem(this.storageKeys.availabelTerminalsKey);

    let list = cached || (JSON.parse(res) as any[]);

    if (!this.utilsService.isArrayEmpty(list)) {
      list = list.map(e => Object.assign(Object.create(Terminal.prototype), e));

      if (this.utilsService.isArrayEmpty(list)) {
        return undefined;
      }

      this.cacheData[this.storageKeys.availabelTerminalsKey] = list;
      return list;
    }
  }

  public setAvailableReasons(reasons: ProvisoryCredentialReason[]) {
    localStorage.setItem(
      this.storageKeys.availableReasonsKey,
      JSON.stringify(reasons)
    );
  }

  public getAvailableReasons(): ProvisoryCredentialReason[] {
    const cached = this.getFromCache(this.storageKeys.availableReasonsKey);
    const res =
      cached || localStorage.getItem(this.storageKeys.availableReasonsKey);

    let list = cached || (JSON.parse(res) as any[]);
    if (!this.utilsService.isArrayEmpty(list)) {
      list = list.map(e =>
        Object.assign(Object.create(ProvisoryCredentialReason.prototype), e)
      );

      if (this.utilsService.isArrayEmpty(list)) {
        return undefined;
      }

      this.cacheData[this.storageKeys.availableReasonsKey] = list;
      return list;
    }
  }

  public setActiveReason(reason: ProvisoryCredentialReason) {
    localStorage.setItem(
      this.storageKeys.activeReasonKey,
      JSON.stringify(reason)
    );
  }

  public getActiveReason(): ProvisoryCredentialReason {
    const cached = this.getFromCache(this.storageKeys.activeReasonKey);
    const cacheOrStorage =
      cached || localStorage.getItem(this.storageKeys.activeReasonKey);
    const ret =
      cacheOrStorage && !cached
        ? Object.assign(
            Object.create(ProvisoryCredentialReason.prototype),
            JSON.parse(cacheOrStorage)
          )
        : undefined;
    this.cacheData[this.storageKeys.activeReasonKey] = ret;
    return ret;
  }

  public setAvailableDocumentTypes(types: DocumentType[]) {
    localStorage.setItem(
      this.storageKeys.availableDocumentTypesKey,
      JSON.stringify(types)
    );
  }

  public getAvailableDocumentTypes(): DocumentType[] {
    const cached = this.getFromCache(
      this.storageKeys.availableDocumentTypesKey
    );
    const res =
      cached ||
      localStorage.getItem(this.storageKeys.availableDocumentTypesKey);

    let list = cached || (JSON.parse(res) as any[]);

    if (!this.utilsService.isArrayEmpty(list)) {
      list = list.map(e =>
        Object.assign(Object.create(DocumentType.prototype), e)
      );

      if (this.utilsService.isArrayEmpty(list)) {
        return undefined;
      }

      this.cacheData[this.storageKeys.availableDocumentTypesKey] = list;
      return list;
    }
  }

  public setActiveDocumentType(type: DocumentType) {
    localStorage.setItem(
      this.storageKeys.activeDocumentTypeKey,
      JSON.stringify(type)
    );
  }

  public getActiveDocumentType(): DocumentType {
    const cached = this.getFromCache(this.storageKeys.activeDocumentTypeKey);
    const cacheOrStorage =
      cached || localStorage.getItem(this.storageKeys.activeDocumentTypeKey);
    const ret =
      cacheOrStorage && !cached
        ? Object.assign(
            Object.create(DocumentType.prototype),
            JSON.parse(cacheOrStorage)
          )
        : undefined;
    this.cacheData[this.storageKeys.activeDocumentTypeKey] = ret;
    return ret;
  }

  public setAuthToken(token) {
    localStorage.setItem(this.storageKeys.authTokenKey, token);
  }

  public getAuthToken() {
    return localStorage.getItem(this.storageKeys.authTokenKey);
  }

  public setActivePerson(person: Person) {
    localStorage.setItem(
      this.storageKeys.activePersonKey,
      JSON.stringify(person)
    );
  }

  public getActivePerson(): Person {
    const cached = this.getFromCache(this.storageKeys.activePersonKey);
    const cacheOrStorage =
      cached || localStorage.getItem(this.storageKeys.activePersonKey);
    const ret =
      cacheOrStorage && !cached
        ? Object.assign(
            Object.create(Person.prototype),
            JSON.parse(cacheOrStorage)
          )
        : undefined;
    this.cacheData[this.storageKeys.activePersonKey] = ret;
    return ret;
  }

  public setPhotoTaken(photo: Photo) {
    localStorage.setItem(this.storageKeys.photoTakenKey, JSON.stringify(photo));
  }

  public removePhotoTaken() {
    localStorage.removeItem(this.storageKeys.photoTakenKey);
  }

  public getPhotoTaken(): Photo {
    const cached = this.getFromCache(this.storageKeys.photoTakenKey);
    const cacheOrStorage =
      cached || localStorage.getItem(this.storageKeys.photoTakenKey);
    const ret =
      cacheOrStorage && !cached
        ? Object.assign(
            Object.create(Photo.prototype),
            JSON.parse(cacheOrStorage)
          )
        : undefined;
    this.cacheData[this.storageKeys.photoTakenKey] = ret;
    return ret;
  }

  /**
   * Remove todas as informações do storage e cache, salvo token e terminal
   */
  public resetStorageToConfiguredState() {
    Object.values(this.storageKeys).forEach(keyVal => {
      if (
        keyVal === this.storageKeys.activeTerminalKey ||
        keyVal === this.storageKeys.authTokenKey ||
        keyVal === this.storageKeys.availabelTerminalsKey
      ) {
        return;
      }
      localStorage.removeItem(keyVal);
    });
    Object.keys(this.cacheData).forEach(key => {
      if (
        key === this.storageKeys.activeTerminalKey ||
        key === this.storageKeys.authTokenKey ||
        key === this.storageKeys.availabelTerminalsKey
      ) {
        return;
      }
      this.cacheData[key] = undefined;
    });
  }

  /**
   * Remove todas as informações do storage e cache
   */
  public resetStorage() {
    Object.values(this.storageKeys).forEach(keyVal => {
      localStorage.removeItem(keyVal);
    });
    Object.keys(this.cacheData).forEach(key => {
      this.cacheData[key] = undefined;
    });
  }

  private getFromCache(key: string) {
    return this.cacheData['key'];
  }
}
