import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageType } from '@core/enums/message-type.enum';
import { CameraPhoto } from '@shared/camera/camera.component';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit {
  countdownValue = 5;
  currentAudioData: any;
  isMessengerVisible = false;
  messages = [];
  MessageType = MessageType;
  photoTaken: CameraPhoto;
  showCameraErrorDialog: boolean;
  cameraErrorContentTextParam = { seconds: this.countdownValue };

  constructor(private translate: TranslateService) {}

  ngOnInit() {}

  getDialog(message) {
    return this.translate.instant(`sara-dialog.${message.text}`);
  }

  exitMessenger() {
    this.messages = [];
    this.isMessengerVisible = false;
  }

  public onCameraError(evt: any, message: any) {
    this.messages.pop();
    this.messages.pop();
    this.showCameraErrorDialog = true;
    message.onCameraError();
  }

  public onPhotoTaken(photo: CameraPhoto, message: any) {
    if (this.photoTaken) {
      // foto ja foi tirada ou nenhuma face foi encontrada
      return;
    }
    this.photoTaken = photo;
    message.onFaceDetected(photo);
  }

  public closeCameraErrDialog() {
    this.showCameraErrorDialog = false;
  }
}
