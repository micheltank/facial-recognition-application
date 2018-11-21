import {
  transition,
  animate,
  trigger,
  state,
  style,
  query,
  group
} from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserActivityDetectorService } from '@core/user-activity-detector/user-activity-detector.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CameraPhoto } from '@shared/camera/camera.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-person-facial-recognition',
  templateUrl: './person-facial-recognition.component.html',
  styleUrls: ['./person-facial-recognition.component.scss']
})
export class PersonFacialRecognitionComponent implements OnInit, OnDestroy {
  public faceDetected: boolean;
  public photoTaken: CameraPhoto;
  public faceFoundFeedback: string;
  public showCameraErrorDialog = false;
  public showPersonNotFoundDialog = false;
  public countdownValue = 5;
  public cameraErrorContentTextParam = { seconds: this.countdownValue };

  public loading = false;

  public user = null;
  public listUser = null;
  public cadastro = false;
  public token = null;
  public recognition = false;

  public persons = [];

  public form: FormGroup;

  public cadastroLabel = 'Cadastrar';

  constructor(
    private translateService: TranslateService,
    private userActivityDetector: UserActivityDetectorService,
    private router: Router,
    private http: HttpClient,
    private appStorageService: AppStorageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.http
      .post('http://40.114.118.243:8080/api/authenticate', {
        username: 'admin',
        password: 'admin'
      })
      .subscribe((token: any) => {
        this.appStorageService.setAuthToken(token.id_token);
        this.getUser();
      });
    this.userActivityDetector.pause();
    this.onPhotoTaken(null);
    this.form = this.formBuilder.group({
      login: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      imageValue: new FormControl()
    });
  }

  ngOnDestroy() {
    this.userActivityDetector.resume();
  }

  public onPhotoTaken(photo: CameraPhoto) {
    this.photoTaken = photo;
    if (this.photoTaken && this.user && this.user.login) {
      this.loading = true;
      this.http
        .post('http://40.114.118.243:8080/api/facial-recognition', {
          username: this.user.login,
          imageValue: this.photoTaken.faceImageDataUrl.replace(
            'data:image/png;base64,',
            ''
          )
        })
        .subscribe(recognition => {
          this.loading = false;
          this.user.recognition = recognition;
        });
    }
  }

  private getUser() {
    this.http
      .get('http://40.114.118.243:8080/api/users')
      .subscribe((persons: any) => {
        this.persons = persons.filter(
          person => person.id !== 1 && person.id !== 3 && person.id !== 4
        );
      });
  }

  public save() {
    const { value } = this.form;
    if (this.photoTaken.faceImageDataUrl) {
      this.cadastroLabel = 'Cadastrando...';
      value.imageValue = this.photoTaken.faceImageDataUrl.replace(
        'data:image/png;base64,',
        ''
      );
      (value.activated = true),
        (value.langKey = 'en'),
        (value.createdBy = 'system'),
        (value.authorities = ['ROLE_USER', 'ROLE_ADMIN']);
      this.http
        .post('http://40.114.118.243:8080/api/users', { ...value })
        .subscribe(() => {
          this.cadastro = false;
          this.getUser();
          this.cadastroLabel = 'Cadastrar';
          this.form.reset();
        });
    }
  }

  public closeCameraErrDialog() {
    this.showCameraErrorDialog = false;
    this.router.navigate(['app', 'home']);
  }

  public closePersonNotFoundDialog() {
    this.showPersonNotFoundDialog = false;
    this.router.navigate(['app', 'home']);
  }

  public onCameraError(evt) {
    this.showCameraErrorDialog = true;
  }

  public onFaceLost() {
    this.faceDetected = false;
    this.translateService
      .get('photo-capture.face-found-feedback-negative')
      .subscribe(str => (this.faceFoundFeedback = str));
  }

  public selectUser(user) {
    this.user = user;
  }

  public onFaceDetected() {
    this.faceDetected = true;
    this.translateService
      .get('photo-capture.face-found-feedback-positive')
      .subscribe(str => (this.faceFoundFeedback = str));
  }
}
