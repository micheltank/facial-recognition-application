import { TagModelType } from '@core/enums/tag-model-type';
import { Person } from '@core/model/person';

export class TagPrintingConfigs {
  public selfServiceterminalId: number;
  public tagModelType: TagModelType;
  public person: Person;
  public cardNumber: number;
  public visitorRoleId: number;
  public visited: Person;
}
