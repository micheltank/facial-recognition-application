import { Person } from './person';
import { CredentialCard } from '@core/model/credential-card';

export class ProvisoryCredential {
  constructor() {}
  public id = 0;
  public expirationDate: Date;
  public role: any;
  public group: any;
  public personVisited: Person;
  public virtualLobby: any;
  public accessCallId: number;
  public situation = 0;
  public scheduledCredentialID = 0;
  public startDate: Date;
  public person: Person;
  public cardCredentialList: CredentialCard[];
}
