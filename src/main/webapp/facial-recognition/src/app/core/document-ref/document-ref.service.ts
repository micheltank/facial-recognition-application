import { Injectable } from '@angular/core';

function getDocument() {
  return document;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentRefService {
  constructor() {}

  public native(): Document {
    return getDocument();
  }
}
