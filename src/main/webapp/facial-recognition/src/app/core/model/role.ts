import { IdNamedModel } from '@core/model/id-named-model';

export class Role implements IdNamedModel {
  public id: number;
  public name: string;
  public usesProvisory: boolean;
  public receivesVisit: boolean;
  public usedBySelfServiceTerminal: boolean;
}
