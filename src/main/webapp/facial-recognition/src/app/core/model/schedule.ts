import { Person } from './person';
import { Role } from '@core/model/role';

export class Schedule {
  public id: number;
  public person: Person;
  public visitedPerson: Person;
  public visitedPlace: any;
  public schedulingDate: string;
  public role: Role;
}
