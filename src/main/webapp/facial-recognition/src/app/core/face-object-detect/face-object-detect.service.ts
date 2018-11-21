import { Injectable, OnDestroy } from '@angular/core';
import { Observer, Observable } from 'rxjs';
import { RectangleCoords } from '@shared/camera/video-face-recognition/rectangle-coords';
import { WindowRefService } from '@core/window-ref/window-ref.service';

declare const objectdetect, Smoother;
/**
 * Wrapper para a biblioteca js-objectdetect https://github.com/mtschirs/js-objectdetect
 */
@Injectable()
export class FaceObjectDetectService implements OnDestroy {
  private static readonly DEFAULT_FACE_DETECTION_TIME = 650;
  private detector: any;
  private smoother: any;
  private detectorObservable: Observable<RectangleCoords>;
  private detectorObserver: Observer<RectangleCoords>;
  private faceRecognitionTimer;
  private faceRecognitionTimeThresholdHit = false;
  private requestAnimationFrameId;

  constructor(private windowRef: WindowRefService) {}

  ngOnDestroy() {
    this.stopFaceDetection();
  }

  public startFaceDetection(
    videoEl: HTMLVideoElement
  ): Observable<RectangleCoords> {
    if (!this.detectorObservable || this.detectorObserver.closed) {
      this.initialize(FaceObjectDetectService.DEFAULT_FACE_DETECTION_TIME);
    }
    this.doDetectFaces(
      videoEl,
      FaceObjectDetectService.DEFAULT_FACE_DETECTION_TIME
    );
    return this.detectorObservable;
  }

  public stopFaceDetection() {
    if (this.requestAnimationFrameId) {
      cancelAnimationFrame(this.requestAnimationFrameId);
    }
    if (this.faceRecognitionTimer) {
      clearTimeout(this.faceRecognitionTimer);
    }
    this.detector = undefined;
    this.smoother = undefined;
    if (this.detectorObserver && !this.detectorObserver.closed) {
      this.detectorObserver.complete();
    }
    this.detectorObserver = undefined;
    this.detectorObservable = undefined;
  }

  private doDetectFaces(videoEl: HTMLVideoElement, faceDetectionTime: number) {
    if (
      videoEl.readyState !== videoEl.HAVE_ENOUGH_DATA ||
      videoEl.videoWidth <= 0
    ) {
      this.requestAnimationFrameId = requestAnimationFrame(
        this.startFaceDetection.bind(this, videoEl)
      );
      return;
    }

    let coords = [0, 0, 0, 0];
    const detectorWidth = ~~((60 * videoEl.videoWidth) / videoEl.videoHeight);
    const detectorHeight = 60;

    if (!this.detector) {
      this.detector = new objectdetect.detector(
        detectorWidth,
        detectorHeight,
        1.1,
        objectdetect.frontalface
      );
    }

    coords = this.detector.detect(videoEl, 1);
    if (coords.length) {
      coords = this.smoother.smooth(coords[0]);

      // Rescale coordinates from detector to video coordinate space:
      coords[0] *= videoEl.width / detectorWidth;
      coords[1] *= videoEl.height / detectorHeight;
      coords[2] *= videoEl.width / detectorWidth;
      coords[3] *= videoEl.height / detectorHeight;

      const left = this.getScaledPixels(coords[0]);
      const top = this.getScaledPixels(coords[1]);
      const width = this.getScaledPixels(coords[2]);
      const height = this.getScaledPixels(coords[3]);

      if (this.faceRecognitionTimeThresholdHit) {
        const faceBoxCoords = new RectangleCoords(left, top, width, height);
        this.detectorObserver.next(faceBoxCoords);
      }
    } else {
      // se nao encontrou nenhuma face, da restart no timer
      this.startFaceDetectionTimer(faceDetectionTime);
      this.detectorObserver.next(RectangleCoords.newEmptyRectangleCoords());
    }

    this.requestAnimationFrameId = requestAnimationFrame(
      this.startFaceDetection.bind(this, videoEl)
    );
  }

  private initialize(faceDetectionTime: number) {
    this.smoother = new Smoother(
      [0.9999999, 0.9999999, 0.999, 0.999],
      [0, 0, 0, 0]
    );
    this.detectorObservable = new Observable<any>((observer: Observer<any>) => {
      this.detectorObserver = observer;
    });
    this.detectorObservable.subscribe();
    this.startFaceDetectionTimer(faceDetectionTime);
  }

  private startFaceDetectionTimer(time: number) {
    this.faceRecognitionTimeThresholdHit = false;
    if (this.faceRecognitionTimer) {
      clearTimeout(this.faceRecognitionTimer);
    }
    this.faceRecognitionTimer = setTimeout(() => {
      this.faceRecognitionTimeThresholdHit = true;
    }, time);
  }

  public getScaledPixels(pixel: number): number {
    return pixel * this.windowRef.native().devicePixelRatio;
  }
}
