import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';

import { CoreModule } from '@core/core.module';
import { CountdownComponent } from '@shared/countdown/countdown.component';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { AppErrorsHandlerComponent } from './app-errors-handler.component';

describe('AppErrorsHandlerComponent', () => {
  let component: AppErrorsHandlerComponent;
  let fixture: ComponentFixture<AppErrorsHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CoreModule,
        TranslateModule,
        RouterTestingModule,
        DialogModule
      ],
      declarations: [
        AppErrorsHandlerComponent,
        CountdownComponent,
        DialogComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppErrorsHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
