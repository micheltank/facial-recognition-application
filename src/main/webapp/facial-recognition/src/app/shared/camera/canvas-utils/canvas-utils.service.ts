import { Injectable } from '@angular/core';
import { RectangleCoords } from '@shared/camera/video-face-recognition/rectangle-coords';
import { WindowRefService } from '@core/window-ref/window-ref.service';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map } from 'rxjs/operators';

@Injectable()
export class CanvasUtilsService {
  constructor(private windowRef: WindowRefService) {}

  /**
   * Recorta um retangulo do conteúdo sendo reproduzido em um elemento video.
   * @param videoEl elemento video com algum conteúdo em reprodução
   * @param rect retangulo da área a ser recortada
   * @param normalizeRect normaliza o retangulo para um quadrado
   * @param mirrorImage espelha a imagem recortada (útil para imagens vindas de camera)
   */
  public cropVideo(
    videoEl: HTMLVideoElement,
    rect: RectangleCoords,
    normalizeRect: boolean,
    mirrorImage = true
  ): Observable<string> {
    const videoContentCanvas = document.createElement(
      'canvas'
    ) as HTMLCanvasElement;
    const rectClone = Object.assign(
      Object.create(RectangleCoords),
      rect
    ) as RectangleCoords;
    videoContentCanvas.width = videoEl.width;
    videoContentCanvas.height = videoEl.height;
    const ctx = videoContentCanvas.getContext('2d');
    ctx.drawImage(
      videoEl,
      0,
      0,
      videoContentCanvas.width,
      videoContentCanvas.height
    );

    if (normalizeRect) {
      // obtem o maior valor entre largura e altura
      const maxFaceRectangleDimension = Math.max(
        rectClone.width,
        rectClone.height
      );

      // faz com que largura e altura sejam iguais, proporcionando um frame quadrado
      rectClone.width = maxFaceRectangleDimension;
      rectClone.height = maxFaceRectangleDimension;

      // adiciona/remove pixels dos eixos x e y para que a face seja centralizada
      const additionalHeightAndWidth = 80; // aumenta a altura total do frame da face
      const addittionalTop = -60;
      const addittionalLeft = -35;

      rectClone.left += addittionalLeft;
      rectClone.top += addittionalTop;
      rectClone.width += additionalHeightAndWidth;
      rectClone.height += additionalHeightAndWidth;
    }

    const faceCrop = ctx.getImageData(
      rectClone.left,
      rectClone.top,
      rectClone.width,
      rectClone.height
    );
    const targetCanvas = document.createElement('canvas') as HTMLCanvasElement;
    targetCanvas.width = rectClone.width;
    targetCanvas.height = rectClone.height;
    const targetCtx = targetCanvas.getContext('2d');
    if (mirrorImage) {
      // remove espelhamento da imagem. Este espelhamento existe apenas quando a imagem
      // provem de uma camera.
      targetCtx.scale(-1, 1);
      targetCtx.translate(-targetCanvas.width, 0);
    }

    return fromPromise(createImageBitmap(faceCrop)).pipe(
      map(bitmap => {
        targetCtx.drawImage(bitmap, 0, 0);
        return targetCanvas.toDataURL();
      })
    );
  }

  public getVideoImageAsDataUrl(video: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = video.width;
    canvas.height = video.height;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  }

  /**
   * Cria o canvas de face frame e retorna as coordenadas do frame desenhado.
   * Se o video gerado pela dispositivo de gravação utilizado não possuir uma
   * dimensão mínima de 700px, o frame não é desenhado.
   * @param canvasEl element canvas
   * @param width largura do canvas
   * @param height altura do canvas
   * @param minVideoDimension menor dimensao suportada pela captura de video (video.videoHeight/Width);
   */
  public createFaceFrameCanvasEl(
    canvasEl: HTMLCanvasElement,
    width: number,
    height: number,
    minVideoDimension: number
  ): RectangleCoords {
    const minRequiredDimension = 700;
    if (minVideoDimension <= minRequiredDimension) {
      // tamanho da camera pequeno demais para utilizar o faceframe
      return RectangleCoords.newEmptyRectangleCoords();
    }
    const minDimension = Math.min(width, height);
    const faceBoxWidthAndHeight = minDimension * 0.85;

    canvasEl.width = width;
    canvasEl.height = height;
    canvasEl.style.width = width + 'px';
    canvasEl.style.height = height + 'px';

    const ctx = canvasEl.getContext('2d');

    ctx.scale(1, 1);

    // apaga conteúdo atual do canvas
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    // configura o canvas para desenhar o poligono que representará o frame para o
    // usuário posicionar o rosto para tirar a foto
    ctx.fillStyle = '#000000';
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const cornerRadius = faceBoxWidthAndHeight - 1;
    const left = halfWidth - faceBoxWidthAndHeight / 2;
    const top = halfHeight - faceBoxWidthAndHeight / 2;
    const rect = new RectangleCoords(
      left,
      top,
      faceBoxWidthAndHeight,
      faceBoxWidthAndHeight
    );

    // configura o ctx para que os poligonos tenham cantos arredondados
    ctx.lineJoin = 'round';
    ctx.lineWidth = cornerRadius;

    // desenha o contorno do poligono
    ctx.strokeRect(
      left + cornerRadius / 2,
      top + cornerRadius / 2,
      faceBoxWidthAndHeight - cornerRadius,
      faceBoxWidthAndHeight - cornerRadius
    );
    // desenha o preenchimento do poligono
    ctx.fillRect(
      left + cornerRadius / 2,
      top + cornerRadius / 2,
      faceBoxWidthAndHeight - cornerRadius,
      faceBoxWidthAndHeight - cornerRadius
    );

    // utiliza xor para conseguir fazer o efeito de 'negativo' no poligono
    ctx.globalCompositeOperation = 'xor';

    // desenha o poligono que ocupara a tela inteira, fazendo com que o
    // globalCompositeOperation === 'xor' exerça o papel desejado sobre o
    // poligono que ficará sobre o elemento em foco
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    return rect;
  }

  public drawRectangle(rect: RectangleCoords, canvasEl: HTMLCanvasElement) {
    if (!rect) {
      return;
    }

    const ctx = canvasEl.getContext('2d');
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.strokeStyle = '#7F7E7E';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;

    ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
  }

  public clearCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    // Store the current transformation matrix
    context.save();

    // Use the identity matrix while clearing the canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    context.restore();
  }

  public getScaledPixels(pixel: number): number {
    return pixel * this.windowRef.native().devicePixelRatio;
  }

  public getUnscaledPixels(pixel: number): number {
    return pixel / this.windowRef.native().devicePixelRatio;
  }
}
