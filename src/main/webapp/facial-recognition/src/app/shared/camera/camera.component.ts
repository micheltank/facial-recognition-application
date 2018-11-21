import {
  Component,
  AfterViewInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { RectangleCoords } from '@shared/camera/video-face-recognition/rectangle-coords';
import { CameraService } from '@core/camera/camera.service';
import { CanvasUtilsService } from '@shared/camera/canvas-utils/canvas-utils.service';
import { FaceObjectDetectService } from '@core/face-object-detect/face-object-detect.service';
import { WindowRefService } from '@core/window-ref/window-ref.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

export enum AppCameraOperationModes {
  CAMERA_ONLY = 'CAMERA_ONLY',
  FACE_RECOGNITION = 'FACE_RECOGNITION',
  FACE_FRAME = 'FACE_FRAME',
  FACE_RECOGNITION_AND_FACE_FRAME = 'FACE_RECOGNITION_AND_FACE_FRAME'
}

export enum AppCameraPhotoModes {
  AUTO_PHOTO = 'AUTO_PHOTO',
  MANUAL_PHOTO = 'MANUAL_PHOTO',
  AUTO_PHOTO_WITH_TIMER = 'AUTO_PHOTO_WITH_TIMER'
}

export interface CameraPhoto {
  /**
   * dataUrl referente a imagem completa
   */
  imageDataUrl: string;
  /**
   * dataUrl referente a boundingBox da face (quando utilizado reconhecimento facial)
   */
  faceImageDataUrl: string;
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  providers: [FaceObjectDetectService, CanvasUtilsService]
})
export class CameraComponent implements AfterViewInit, OnDestroy {
  @Input()
  public operationMode = AppCameraOperationModes.FACE_RECOGNITION;
  @Input()
  public photoMode = AppCameraPhotoModes.AUTO_PHOTO;
  @Input()
  public autoPhotoTimer = 0;
  /**
   * Largura do componente.
   */
  @Input()
  public overallWidth;
  /**
   * Altura do componente.
   */
  @Input()
  public overallHeight;
  /**
   * largura total do elemento de video. Dependendo do hardware subjascente, poderá ser
   * desconsiderado. (ex.: caso seja passado um width nao suportado pela camera do dispositivo)
   */
  @Input()
  public width;
  /**
   * altura total do elemento de video. Dependendo do hardware subjascente, poderá ser
   * desconsiderado. (ex.: caso seja passado um height nao suportado pela camera do dispositivo)
   */
  @Input()
  public height;
  /**
   * timeout utilizado para considerar a face do usuário como não presente
   */
  @Input()
  public faceNotPresentTimeout = 10000;
  /**
   * emite quando o timeout faceNotPresentTimeout for atingido
   */
  @Output()
  public faceNotPresent = new EventEmitter();
  /**
   * emite quando uma face for encontrada e logo em seguida perdida
   */
  @Output()
  public faceLost = new EventEmitter();
  /**
   * emite quando uma face for detectada
   */
  @Output()
  public faceDetected = new EventEmitter();
  @Output()
  public photoTaken = new EventEmitter<CameraPhoto>();
  @Output()
  public cameraError = new EventEmitter<any>();
  @Output()
  public photoTimer = new EventEmitter<any>();

  @ViewChild('cameraVideo')
  public cameraVideoElRef: ElementRef;
  @ViewChild('faceRecognitionCanvasElRef')
  public faceRecognitionCanvasElRef: ElementRef;
  @ViewChild('faceFrameCanvasElRef')
  public faceFrameCanvasElRef: ElementRef;
  @ViewChild('sectionContainer')
  public sectionContainerElRef: ElementRef;

  private faceNotPresentTimeoutId;
  private readonly AUTO_PHOTO_DELAY = 3.25;
  private autoPhotoIntervalSubscription: Subscription;
  private autoPhotoIntervalId;
  private autoPhotoTimeoutId;
  private videoEl: HTMLVideoElement;
  private originalVideoElDisplay: string;
  private faceBoxCanvasEl: HTMLCanvasElement;

  public photoo;

  // As dimensões informadas para o elemento video que
  // fará a reprodução da câmera não necessáriamente são
  // suportadas pela câmera, por isso são tratadas como
  // 'preferenciais'.
  /**
   * Largura preferencial do video da câmera. Caso não seja informado,
   * é iniciado automaticamente com screen.width. Valor em CSS Pixels.
   */
  private optimalWidth: number;
  /**
   * Altura preferencial do video da câmera. Caso não seja informado,
   * é iniciado automaticamente com screen.height. Valor em CSS Pixels.
   */
  private optimalHeight: number;
  /**
   * Altura efetivamente suportada pelo dispositivo de gravação.
   * Valor em CSS Pixels.
   */
  private effectiveHeight: number;
  /**
   * Largura efetivamente suportada pelo dispositivo de gravação.
   * Valor em CSS Pixels.
   */
  private effectiveWidth: number;
  /**
   * Proporção do dispositivo de gravação
   */
  private effectiveAspect: number;
  private devicePixelRatio: number;
  private onPhotoTakenSubscription: Subscription;
  private faceFoundRect: RectangleCoords = RectangleCoords.newEmptyRectangleCoords();
  private faceFrameRect: RectangleCoords;

  constructor(
    private faceObjectDetectService: FaceObjectDetectService,
    private canvasUtilsService: CanvasUtilsService,
    private cameraService: CameraService,
    private windowRef: WindowRefService
  ) {}

  ngAfterViewInit() {
    this.devicePixelRatio = this.windowRef.native().devicePixelRatio;
    this.optimalWidth = this.width || screen.width;
    this.optimalHeight = this.height || screen.height;
    if (this.isSizeCustomized()) {
      this.sectionContainerElRef.nativeElement.style.width = `${
        this.overallWidth
      }px`;
      this.sectionContainerElRef.nativeElement.style.height = `${
        this.overallHeight
      }px`;
    }
    this.initVideoEl();
    this.initCamera();
  }

  ngOnDestroy() {
    clearTimeout(this.faceNotPresentTimeoutId);
    clearTimeout(this.autoPhotoTimeoutId);
    clearInterval(this.autoPhotoIntervalId);
    if (this.autoPhotoIntervalSubscription) {
      this.autoPhotoIntervalSubscription.unsubscribe();
    }
  }

  private initVideoEl() {
    this.videoEl = this.cameraVideoElRef.nativeElement as HTMLVideoElement;
    this.videoEl.width = this.optimalWidth;
    this.videoEl.height = this.optimalHeight;
    this.videoEl.style.width = `${this.optimalWidth}px`;
    this.videoEl.style.height = `${this.optimalHeight}px`;
    if (this.isSizeCustomized()) {
      this.cameraVideoElRef.nativeElement.style.width = `${
        this.overallWidth
      }px`;
      this.cameraVideoElRef.nativeElement.style.height = `${
        this.overallHeight
      }px`;
    }
    this.videoEl.onerror = err => {
      this.cameraError.emit(err);
    };
  }

  private initCamera() {
    if (!this.hasGetUserMedia()) {
      this.cameraError.emit(
        'This browser does not support camera features (No getUserMedia)'
      );
    }

    const videoConstraints: MediaTrackConstraints = {
      height: this.optimalHeight,
      facingMode: {
        ideal: 'user'
      }
    };
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: videoConstraints
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(mediaStream => {
        this.videoEl.srcObject = mediaStream;
        this.videoEl.onloadedmetadata = e => {
          this.updateEffectiveVideoDimensions();
          this.updateVideoElDimensions();
          this.initFaceBoxCanvasEl();
          this.initFaceFrameCanvasEl();
          this.startFaceNotPresentTimeout();
          this.startFaceRecognition();
        };
      })
      .catch(err => {
        this.cameraError.emit(err);
      });
  }

  isSizeCustomized() {
    return this.overallWidth || this.overallHeight;
  }

  /**
   * Obtém as dimensões efetivamente suportadas
   * pelo dispositivo de captura de video.
   */
  private updateEffectiveVideoDimensions() {
    if (this.videoEl.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      // deve ser chamado apenas se this.videoEl estiver ativo e
      // reproduzindo conteúdo.
      throw Error(
        'Não é possível obter as dimensões efetivas de um elemento vídeo sem dados.'
      );
    }
    /**
     * aspecto efetivamente em uso pela video da camera
     */
    this.effectiveAspect = this.videoEl.videoWidth / this.videoEl.videoHeight;
    /**
     * aspecto preferencial
     */
    const optimalAspect = this.optimalWidth / this.optimalHeight;
    /**
     * altura, no aspecto effetivo, em relação ao optimalWidth
     */
    const inAspectHeight = this.optimalWidth / this.effectiveAspect;

    this.effectiveHeight = this.optimalHeight;
    this.effectiveWidth = this.optimalWidth;

    if (this.effectiveAspect === optimalAspect) {
      return;
    }

    if (inAspectHeight <= this.optimalHeight) {
      // o video suportado tem altura menor que a preferencial,
      // diminui a altura e mantem a largura.
      this.effectiveHeight = inAspectHeight;
    } else {
      // o video suportado tem largura menor que a preferencial
      // mantem a altura e diminui a largura
      this.effectiveWidth = this.videoEl.height * this.effectiveAspect;
    }
  }

  /**
   * Atualiza as dimensoes do elemento video.
   */
  private updateVideoElDimensions() {
    this.videoEl.height = this.effectiveHeight;
    this.videoEl.width = this.effectiveWidth;
    this.videoEl.style.width = `${this.videoEl.width}px`;
    this.videoEl.style.height = `${this.videoEl.height}px`;
    if (this.isSizeCustomized()) {
      this.cameraVideoElRef.nativeElement.style.width = `${
        this.overallWidth
      }px`;
      this.cameraVideoElRef.nativeElement.style.height = `${
        this.overallHeight
      }px`;
    }
  }

  /**
   * inicia o canvas onde será desenhada a bounding-box da detecção facial
   */
  private initFaceBoxCanvasEl() {
    this.faceBoxCanvasEl = this.faceRecognitionCanvasElRef
      .nativeElement as HTMLCanvasElement;
    if (!this.isSizeCustomized()) {
      this.faceBoxCanvasEl.width = this.effectiveWidth * this.devicePixelRatio;
      this.faceBoxCanvasEl.height =
        this.effectiveHeight * this.devicePixelRatio;
      this.faceBoxCanvasEl.style.width = `${this.effectiveWidth}px`;
      this.faceBoxCanvasEl.style.height = `${this.effectiveHeight}px`;
    }
  }

  /**
   * inicia o canvas onde será desenhada a moldura para o rosto
   */
  private initFaceFrameCanvasEl() {
    if (
      this.operationMode ===
        AppCameraOperationModes.FACE_RECOGNITION_AND_FACE_FRAME ||
      this.operationMode === AppCameraOperationModes.FACE_FRAME
    ) {
      const videoWidth = this.videoEl.videoWidth;
      const videoHeight = this.videoEl.videoHeight;

      this.faceFrameRect = this.canvasUtilsService.createFaceFrameCanvasEl(
        this.faceFrameCanvasElRef.nativeElement,
        this.effectiveWidth,
        this.effectiveHeight,
        Math.min(videoWidth, videoHeight)
      );
    }
  }

  /**
   * inicia o contador que emite o evento this.faceNotPresent caso
   * uma face não seja encontrada durante this.faceNotPresentTimeoutId segundos;
   */
  private startFaceNotPresentTimeout() {
    if (this.faceNotPresentTimeoutId) {
      return;
    }

    this.faceNotPresentTimeoutId = setTimeout(() => {
      this.faceNotPresent.emit();
      clearTimeout(this.faceNotPresentTimeoutId);
      this.faceNotPresentTimeoutId = undefined;
    }, this.faceNotPresentTimeout);
  }

  /**
   * inicia a rotina de detecção facial
   */
  private startFaceRecognition() {
    this.faceObjectDetectService
      .startFaceDetection(this.videoEl)
      .subscribe((result: RectangleCoords) => {
        this.faceFoundRect = result;
        this.startManualPhotoTakenListener();

        this.videoEl.style.display =
          this.originalVideoElDisplay || this.videoEl.style.display;

        this.canvasUtilsService.clearCanvas(this.faceBoxCanvasEl);
        if (!RectangleCoords.isEmptyRectangleCoords(this.faceFoundRect)) {
          this.drawFaceBox();
          clearTimeout(this.faceNotPresentTimeoutId);
          clearTimeout(this.faceNotPresentTimeoutId);
          this.startTakeAutoPhoto();
        } else {
          this.startFaceNotPresentTimeout();
          this.autoPhotoTimeoutId = undefined;
          this.faceLost.emit();
          this.photoTaken.emit(null);
        }
      });
  }

  private drawFaceBox() {
    if (
      this.operationMode === AppCameraOperationModes.FACE_RECOGNITION ||
      this.operationMode ===
        AppCameraOperationModes.FACE_RECOGNITION_AND_FACE_FRAME
    ) {
      this.canvasUtilsService.drawRectangle(
        this.faceFoundRect,
        this.faceBoxCanvasEl
      );
    }
  }

  private startManualPhotoTakenListener() {
    // se for modo manual, registra um callback para o evento
    // de photoTaken
    if (
      this.photoMode === AppCameraPhotoModes.MANUAL_PHOTO &&
      !this.onPhotoTakenSubscription
    ) {
      this.onPhotoTakenSubscription = this.cameraService
        .onPhotoTaken()
        .subscribe(() => {
          // só tira a foto efetivamente se houver uma face encontrada
          if (!RectangleCoords.isEmptyRectangleCoords(this.faceFoundRect)) {
            this.takePhoto().subscribe(() =>
              this.faceObjectDetectService.stopFaceDetection()
            );
          }
        });
    }
  }

  private startTakeAutoPhoto() {
    if (this.photoMode === AppCameraPhotoModes.AUTO_PHOTO) {
      // no modo automatico, assim que encontrar uma face, tira a foto e finaliza
      if (this.autoPhotoTimeoutId) {
        return;
      }
      if (this.autoPhotoTimer < 0) {
        this.autoPhotoTimer = 0;
      }
      this.autoPhotoTimeoutId = setTimeout(() => {
        if (!RectangleCoords.isEmptyRectangleCoords(this.faceFoundRect)) {
          this.takePhoto().subscribe();
        }
      }, this.autoPhotoTimer);
    } else if (this.photoMode === AppCameraPhotoModes.AUTO_PHOTO_WITH_TIMER) {
      if (this.autoPhotoIntervalId && this.autoPhotoIntervalSubscription) {
        return;
      }

      this.autoPhotoIntervalSubscription = this.getPhotoInterval(
        this.AUTO_PHOTO_DELAY
      ).subscribe(() => {
        this.takePhoto().subscribe();
      });
    }
  }

  private getPhotoInterval(time: number): Observable<any> {
    const photoSubject = new Subject();
    let photoTimer = time;
    this.autoPhotoIntervalId = setInterval(() => {
      if (RectangleCoords.isEmptyRectangleCoords(this.faceFoundRect)) {
        photoTimer = time;
      }
      this.photoTimer.emit(Math.abs(Math.round(photoTimer)));
      photoTimer -= 0.25;
      if (photoTimer < 0) {
        clearInterval(this.autoPhotoIntervalId);
        this.photoTimer.emit(Math.abs(Math.round(photoTimer)));
        photoSubject.next();
      }
    }, 250);
    return photoSubject;
  }

  private takePhoto(): Observable<boolean> {
    let rect: RectangleCoords;
    let normalizeRect: boolean;
    if (
      (this.operationMode === AppCameraOperationModes.FACE_RECOGNITION ||
        this.operationMode ===
          AppCameraOperationModes.FACE_RECOGNITION_AND_FACE_FRAME) &&
      !RectangleCoords.isEmptyRectangleCoords(this.faceFrameRect)
    ) {
      // se o face frame está atuvo, utiliza-o para cortar a foto
      rect = this.faceFrameRect;
      normalizeRect = false;
    } else {
      // caso contrário, utiliza o face box
      rect = this.faceFoundRect;
      normalizeRect = true;
    }
    return this.canvasUtilsService
      .cropVideo(this.videoEl, rect, normalizeRect)
      .pipe(
        map(croppedFace => {
          const imageDataUrl = this.canvasUtilsService.getVideoImageAsDataUrl(
            this.videoEl
          );
          this.photoTaken.emit({
            imageDataUrl,
            faceImageDataUrl: croppedFace
          } as CameraPhoto);
          return true;
        })
      );
  }

  private hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}
