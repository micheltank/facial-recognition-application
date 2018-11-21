import { IdNamedModel } from '@core/model/id-named-model';
import { TerminalProperties } from '@core/model/terminal-properties';
import { TerminalManufacturer } from '@core/enums/terminal-manufacturer';

export class Terminal implements IdNamedModel {
  public id: number;
  public name: string;
  public manufacturer: TerminalManufacturer;
  public physicalLocation: any;
  public propertySelfServiceTerminal: TerminalProperties;
  public status: boolean;
  public dispenserPorts: any[];
  public useMultiplePorts: boolean;
  public provisoryEntryAllowed: boolean;
  public visitorEntryAllowed: boolean;
}
