import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFacialRecognitionComponent } from './person-facial-recognition.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PersonFacialRecognitionComponent', () => {
  let component: PersonFacialRecognitionComponent;
  let fixture: ComponentFixture<PersonFacialRecognitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        CoreModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      declarations: [PersonFacialRecognitionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonFacialRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
