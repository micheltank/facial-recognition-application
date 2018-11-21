import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { CountdownComponent } from './countdown/countdown.component';
import { AppErrorsHandlerComponent } from './app-errors-handler/app-errors-handler.component';
import { CameraComponent } from '@shared/camera/camera.component';
import { LoadingComponent } from './loading/loading.component';
import { AutofocusDirective } from '@shared/autofocus/autofocus.directive';
import { MessengerComponent } from './messenger/messenger.component';
import { LoaderComponent } from './loader/loader.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { RecognizedComponent } from './recognized/recognized.component';
import { BlockedComponent } from './blocked/blocked.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule
  ],
  declarations: [
    CountdownComponent,
    AppErrorsHandlerComponent,
    CameraComponent,
    LoadingComponent,
    AutofocusDirective,
    MessengerComponent,
    LoaderComponent,
    EmptyStateComponent,
    RecognizedComponent,
    BlockedComponent
  ],
  exports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CountdownComponent,
    AppErrorsHandlerComponent,
    CameraComponent,
    LoadingComponent,
    AutofocusDirective,
    MessengerComponent,
    LoaderComponent,
    EmptyStateComponent,
    RecognizedComponent,
    BlockedComponent
  ]
})
export class SharedModule {}
