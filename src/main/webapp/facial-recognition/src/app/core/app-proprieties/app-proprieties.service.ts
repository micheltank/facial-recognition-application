import { Injectable, EventEmitter } from '@angular/core';
import { EntryType } from '@core/enums/entry-type.enum';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { TerminalProperties } from '@core/model/terminal-properties';
import { UtilsService } from '@core/utils/utils.service';
import { TerminalManufacturer } from '@core/enums/terminal-manufacturer';

@Injectable()
export class AppProprietiesService {
  constructor(
    private appStorageService: AppStorageService,
    private utilsService: UtilsService
  ) {}

  public isLoggedIn(): boolean {
    return (
      this.appStorageService.getAuthToken() &&
      !!this.appStorageService.getAuthToken()
    );
  }

  public hasSelectedTerminal(): boolean {
    return (
      this.appStorageService.getActiveTerminal() &&
      !!this.appStorageService.getActiveTerminal().id
    );
  }

  public getTerminalProperties(): TerminalProperties {
    const terminal = this.appStorageService.getActiveTerminal();
    return terminal && terminal.propertySelfServiceTerminal
      ? terminal.propertySelfServiceTerminal
      : undefined;
  }

  hasSurvey(): boolean {
    const entryType = this.appStorageService.getActiveEntryType();
    const activeTerminalProperties = this.appStorageService.getActiveTerminal()
      .propertySelfServiceTerminal;
    switch (entryType) {
      case EntryType.SCHEDULED:
        const schedule = this.appStorageService.getActiveSchedule();
        return (
          schedule.person.takeSurvey &&
          activeTerminalProperties.feedbackPoll &&
          activeTerminalProperties.feedbackPollQuestionForScheduledVisit
            .question.id !== 0
        );
      case EntryType.NOT_SCHEDULED:
        const person = this.appStorageService.getActivePerson();
        return (
          person.takeSurvey &&
          activeTerminalProperties.feedbackPoll &&
          activeTerminalProperties.feedbackPollQuestionForProvisoryCard.question
            .id !== 0
        );
      default:
        return false;
    }
  }

  public hasAvailableReasons() {
    const reasons = this.appStorageService.getAvailableReasons();
    return !this.utilsService.isArrayEmpty(reasons);
  }

  public isVideosoft() {
    const terminal = this.appStorageService.getActiveTerminal();
    return terminal && terminal.manufacturer === TerminalManufacturer.VIDEOSOFT;
  }

  public isRemoteAccess() {
    const terminal = this.appStorageService.getActiveTerminal();
    return (
      terminal && terminal.manufacturer === TerminalManufacturer.ACESSO_REMOTO
    );
  }

  public isDigicon() {
    const terminal = this.appStorageService.getActiveTerminal();
    return terminal && terminal.manufacturer === TerminalManufacturer.DIGICON;
  }

  hasAcceptTerms(): boolean {
    const entryType = this.appStorageService.getActiveEntryType();
    const terminal = this.appStorageService.getActiveTerminal();

    if (!terminal) {
      return false;
    }

    const activeTerminalProperties = terminal.propertySelfServiceTerminal;
    if (activeTerminalProperties) {
      switch (entryType) {
        case EntryType.SCHEDULED:
          return activeTerminalProperties.termOfAgreeForScheduledVisit;
        case EntryType.NOT_SCHEDULED:
          return activeTerminalProperties.termOfAgreeForProvisoryCard;
        default:
          return false;
      }
    } else {
      return false;
    }
  }
}
