import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonFacialRecognitionComponent } from '@app/person-facial-recognition/person-facial-recognition.component';

const routes: Routes = [
  {
    path: '',
    component: PersonFacialRecognitionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonFacialRecognitionRoutingModule {}
