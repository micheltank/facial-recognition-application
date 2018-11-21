import { TestBed, inject } from '@angular/core/testing';

import { AppProprietiesService } from './app-proprieties.service';
import { EntryType } from '@core/enums/entry-type.enum';
import { Terminal } from '@core/model/terminal';
import { TerminalProperties } from '@core/model/terminal-properties';
import { FeedbackQuestion, Question } from '@core/model/feedback-question';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { Person } from '@core/model/person';
import { UtilsService } from '@core/utils/utils.service';
import { WindowRefService } from '@core/window-ref/window-ref.service';
import { TerminalManufacturer } from '@core/enums/terminal-manufacturer';

describe('AppProprietiesService', () => {
  let terminal: Terminal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WindowRefService,
        UtilsService,
        AppProprietiesService,
        AppStorageService
      ]
    });
    terminal = new Terminal();
    terminal.propertySelfServiceTerminal = new TerminalProperties();
    terminal.propertySelfServiceTerminal.termOfAgreeForScheduledVisit = false;
    terminal.propertySelfServiceTerminal.termOfAgreeForProvisoryCard = false;
    terminal.propertySelfServiceTerminal.feedbackPoll = true;
    terminal.propertySelfServiceTerminal.feedbackPollQuestionForScheduledVisit = new FeedbackQuestion();
    terminal.propertySelfServiceTerminal.feedbackPollQuestionForScheduledVisit.question = new Question();
    terminal.propertySelfServiceTerminal.feedbackPollQuestionForScheduledVisit.question.id = 0;
    terminal.propertySelfServiceTerminal.feedbackPollQuestionForProvisoryCard = new FeedbackQuestion();
    terminal.propertySelfServiceTerminal.feedbackPollQuestionForProvisoryCard.question = new Question();
    terminal.propertySelfServiceTerminal.feedbackPollQuestionForProvisoryCard.question.id = 0;
  });

  it('should be created', inject(
    [AppProprietiesService],
    (service: AppProprietiesService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('hasAcceptTerms should return true for SCHEDULED', inject(
    [AppProprietiesService],
    (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-entry-type') {
          return JSON.stringify(EntryType.SCHEDULED);
        }
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.propertySelfServiceTerminal.termOfAgreeForScheduledVisit = true;
          return JSON.stringify(terminal);
        }
      });
      expect(service.hasAcceptTerms()).toBeTruthy();
    }
  ));

  it('hasAcceptTerms should return false for SCHEDULED', inject(
    [AppProprietiesService],
    (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-entry-type') {
          return JSON.stringify(EntryType.SCHEDULED);
        }
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          return JSON.stringify(terminal);
        }
      });
      expect(service.hasAcceptTerms()).toBeFalsy();
    }
  ));

  it('hasAcceptTerms should return true for NOT_SCHEDULED', inject(
    [AppProprietiesService],
    (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-entry-type') {
          return JSON.stringify(EntryType.NOT_SCHEDULED);
        }
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.propertySelfServiceTerminal.termOfAgreeForProvisoryCard = true;
          return JSON.stringify(terminal);
        }
      });
      expect(service.hasAcceptTerms()).toBeTruthy();
    }
  ));

  it('hasAcceptTerms should return false for NOT_SCHEDULED', inject(
    [AppProprietiesService],
    (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-entry-type') {
          return JSON.stringify(EntryType.NOT_SCHEDULED);
        }
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          return JSON.stringify(terminal);
        }
      });
      expect(service.hasAcceptTerms()).toBeFalsy();
    }
  ));

  it('hasSurvey should return true for SCHEDULED', inject(
    [AppProprietiesService],
    (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-entry-type') {
          return JSON.stringify(EntryType.SCHEDULED);
        }
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.propertySelfServiceTerminal.feedbackPollQuestionForScheduledVisit.question.id = 1;
          return JSON.stringify(terminal);
        }
        if (key === 'br.com.senior.sam.totem.active-schedule') {
          const person = new Person();
          person.takeSurvey = true;
          return JSON.stringify({
            id: 1,
            person: person
          });
        }
      });
      expect(service.hasSurvey()).toBeTruthy();
    }
  ));

  it('hasSurvey should return false for SCHEDULED', inject(
    [AppProprietiesService],
    (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-entry-type') {
          return JSON.stringify(EntryType.SCHEDULED);
        }
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          return JSON.stringify(terminal);
        }
        if (key === 'br.com.senior.sam.totem.active-schedule') {
          const person = new Person();
          person.takeSurvey = true;
          return JSON.stringify({
            id: 1,
            person: person
          });
        }
      });
      expect(service.hasSurvey()).toBeFalsy();
    }
  ));

  it('hasSurvey should return true for NOT_SCHEDULED', inject(
    [AppProprietiesService],
    (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-entry-type') {
          return JSON.stringify(EntryType.NOT_SCHEDULED);
        }
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.propertySelfServiceTerminal.feedbackPollQuestionForProvisoryCard.question.id = 1;
          return JSON.stringify(terminal);
        }
        if (key === 'br.com.senior.sam.totem.active-person') {
          const person = new Person();
          person.takeSurvey = true;
          return JSON.stringify(person);
        }
      });
      expect(service.hasSurvey()).toBeTruthy();
    }
  ));

  it('hasSurvey should return false for NOT_SCHEDULED', inject(
    [AppProprietiesService],
    (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-entry-type') {
          return JSON.stringify(EntryType.NOT_SCHEDULED);
        }
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          return JSON.stringify(terminal);
        }
        if (key === 'br.com.senior.sam.totem.active-person') {
          const person = new Person();
          person.takeSurvey = true;
          return JSON.stringify(person);
        }
      });
      expect(service.hasSurvey()).toBeFalsy();
    }
  ));

  it('hasSurvey should return false because survey is already taken', inject(
    [AppProprietiesService],
    (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-entry-type') {
          return JSON.stringify(EntryType.NOT_SCHEDULED);
        }
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.propertySelfServiceTerminal.feedbackPollQuestionForProvisoryCard.question.id = 1;
          return JSON.stringify(terminal);
        }
        if (key === 'br.com.senior.sam.totem.active-person') {
          const person = new Person();
          person.takeSurvey = false;
          return JSON.stringify(person);
        }
      });
      expect(service.hasSurvey()).toBeFalsy();
    }
  ));

  it('isVideosoft should return true', () =>
    inject([AppProprietiesService], (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.manufacturer = TerminalManufacturer.VIDEOSOFT;
          return JSON.stringify(terminal);
        }
      });
      expect(service.isVideosoft()).toBeTruthy();
    }));

  it('isVideosoft should return false', () =>
    inject([AppProprietiesService], (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.manufacturer = TerminalManufacturer.ACESSO_REMOTO;
          return JSON.stringify(terminal);
        }
      });
      expect(service.isVideosoft()).toBeFalsy();
    }));

  it('isRemoteAccess should return true', () =>
    inject([AppProprietiesService], (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.manufacturer = TerminalManufacturer.ACESSO_REMOTO;
          return JSON.stringify(terminal);
        }
      });
      expect(service.isRemoteAccess()).toBeTruthy();
    }));

  it('isRemoteAccess should return false', () =>
    inject([AppProprietiesService], (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.manufacturer = TerminalManufacturer.VIDEOSOFT;
          return JSON.stringify(terminal);
        }
      });
      expect(service.isRemoteAccess()).toBeFalsy();
    }));

  it('isDigicon should return true', () =>
    inject([AppProprietiesService], (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.manufacturer = TerminalManufacturer.DIGICON;
          return JSON.stringify(terminal);
        }
      });
      expect(service.isDigicon()).toBeTruthy();
    }));

  it('isDigicon should return false', () =>
    inject([AppProprietiesService], (service: AppProprietiesService) => {
      spyOn(localStorage, 'getItem').and.callFake((key, value) => {
        if (key === 'br.com.senior.sam.totem.active-terminal') {
          terminal.manufacturer = TerminalManufacturer.VIDEOSOFT;
          return JSON.stringify(terminal);
        }
      });
      expect(service.isDigicon()).toBeFalsy();
    }));
});
