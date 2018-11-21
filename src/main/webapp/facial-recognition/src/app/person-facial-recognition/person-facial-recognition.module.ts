import { NgModule } from '@angular/core';
import { PersonFacialRecognitionRoutingModule } from './person-facial-recognition-routing.module';
import { PersonFacialRecognitionComponent } from './person-facial-recognition.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [SharedModule, PersonFacialRecognitionRoutingModule],
  declarations: [PersonFacialRecognitionComponent]
})
export class PersonFacialRecognitionModule {}
