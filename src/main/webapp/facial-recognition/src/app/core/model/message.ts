import { MessageType } from '@core/enums/message-type.enum';
import { Routine } from './routine';
import { Schedule } from './schedule';

export class Message {
  type: MessageType;
  text?: string;
  options?: Array<Routine>;
  onFaceDetected?: (photo) => void;
  onCameraError?: () => void;
  onFaceLost?: () => void;
  schedule?: Schedule;
  audioData?: ArrayBuffer;
  voiceFile?: string;
}
