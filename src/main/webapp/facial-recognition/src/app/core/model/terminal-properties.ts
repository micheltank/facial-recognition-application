import { IdNamedModel } from '@core/model/id-named-model';
import { FeedbackQuestion } from '@core/model/feedback-question';

export class TerminalProperties implements IdNamedModel {
  public id: number;
  public name: string;
  public backgroundColor: string;
  public companyLogoURL: string;
  public welcomeMessageList: any[];

  // login do usuario
  public searchAttemptsPersonByUserAndPassword: number;

  // validades da credencial
  public validityCredentialWithSchedulingInHours: number;
  public validityCredentialWithoutSchedulingInDays: number;

  // validade do agendamento
  public useSchedulingTolerance: boolean;
  public schedulingToleranceInMinutes: number;

  // validades da foto
  public photoValidityInDaysForProvisoryCard: number;
  public photoValidityInDaysForScheduledVisit: number;

  // reconhecimento facial
  public hasFacialRecognition: boolean;
  public facialRecognitionForScheduledVisit: boolean;
  public facialRecognitionForProvisoryCard: boolean;
  public photoConferencePercentage: number;

  // termos de aceite
  public termOfAgreeForProvisoryCard: boolean;
  public termOfAgreeForScheduledVisit: boolean;
  public termOfAgreeList: any[];

  // formas de entrada da entrega de credencial provisória
  public searchPersonByDocument: boolean;
  public searchPersonByUserAndPassword: boolean;

  // pesquisa de satisfação
  public feedbackPoll: boolean;
  public validityFeedbackPollInDays: number;
  public feedbackPollQuestionForProvisoryCard: FeedbackQuestion;
  public feedbackPollQuestionForScheduledVisit: FeedbackQuestion;

  // arquivos de tradução
  public ptbrDictionaryFileUrl: string;
  public enDictionaryFileUrl: string;
  public esDictionaryFileUrl: string;

  // Controle de fotos
  public visitScheduledChangePhoto: string;
  public credentialNotScheduleChangePhoto: string;

  // Impressão
  public printReceiptForVisitor: string;
  public printReceiptForWorker: string;

  public takePhotoAutomatically: boolean;

  // Sara
  public saraEnabled: boolean;
}
