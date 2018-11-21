import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: 'facial-recognition',
    loadChildren:
      './person-facial-recognition/person-facial-recognition.module#PersonFacialRecognitionModule'
  },
  {
    path: '',
    redirectTo: '/facial-recognition',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
