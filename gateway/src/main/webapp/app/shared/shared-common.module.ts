import { NgModule } from '@angular/core';

import { FacialRecognitionSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [FacialRecognitionSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [FacialRecognitionSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class FacialRecognitionSharedCommonModule {}
