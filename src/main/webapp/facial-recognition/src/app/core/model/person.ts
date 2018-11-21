import { IdNamedModel } from '@core/model/id-named-model';

export class Person implements IdNamedModel {
  public id: number;
  public name: string;
  public mandatoryDocuments: any[];
  public preferentialPhone: any;
  public preferentialEmail: any;
  public takeSurvey: boolean;

  // campo abaixo não existe no model do backend,
  // foi adicionado para facilitar o controle de
  // reconhecimento facial no front
  public faceRecognized: boolean;
}
