import { Injectable } from '@angular/core';
import { Photo } from '@core/model/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor() {}

  getPhotoUrl(photo: Photo) {
    if (photo && photo.photoURL) {
      return photo.photoURL;
    }
    return 'assets/images/profile-avatar.png';
  }
}
