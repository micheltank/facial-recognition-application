export class RectangleCoords {
  constructor(
    public left: number,
    public top: number,
    public width: number,
    public height: number
  ) {}

  public static newEmptyRectangleCoords() {
    return new RectangleCoords(-1, -1, -1, -1);
  }

  public static isEmptyRectangleCoords(rectCoords: RectangleCoords) {
    return (
      rectCoords === undefined ||
      (rectCoords.left === -1 &&
        rectCoords.top === -1 &&
        rectCoords.width === -1 &&
        rectCoords.height === -1)
    );
  }
}
