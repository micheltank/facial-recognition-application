import { RectangleCoords } from './rectangle-coords';

/**
 * Representa o resultado de uma detecção facial de um video
 */
export class FaceDetectionResult {
  constructor(
    /**
     * indica se há alguma face encontrada
     */
    public faceFound: boolean,
    /**
     * coordenadas da bounding box da face encontrada
     */
    public faceBoxCoords: RectangleCoords
  ) {}
}
