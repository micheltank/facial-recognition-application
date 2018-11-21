import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { CustomTranslateLoader } from '@core/custom-translate-loader';
import { throwIfAlreadyLoaded } from '@core/module-import-guard';
import { FullscreenDisableDetectorService } from '@core/fullscreen-disable-detector/fullscreen-disable-detector.service';
import { UserActivityDetectorService } from '@core/user-activity-detector/user-activity-detector.service';
import { AppEventsService } from '@core/app-events/app-events.service';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { BackendService } from '@core/backend/backend.service';
import { UtilsService } from '@core/utils/utils.service';
import { CanActivateTerminalDependantPage } from '@core/can-load-terminal-dependant-page.service';
import { CameraService } from '@core/camera/camera.service';
import { AppProprietiesService } from './app-proprieties/app-proprieties.service';
import { WindowRefService } from '@core/window-ref/window-ref.service';
import { DocumentRefService } from '@core/document-ref/document-ref.service';
import { VirtualKeyboardService } from '@core/virtual-keyboard/virtual-keyboard.service';
import { NavigationService } from '@core/navigation/navigation.service';

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader
      },
      useDefaultLang: true
    })
  ],
  providers: [
    // thirdparty services
    ConfirmationService,

    // app services
    WindowRefService,
    UtilsService,
    FullscreenDisableDetectorService,
    UserActivityDetectorService,
    AppEventsService,
    AppStorageService,
    BackendService,
    CanActivateTerminalDependantPage,
    CameraService,
    AppProprietiesService,
    DocumentRefService,
    VirtualKeyboardService,
    NavigationService
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
