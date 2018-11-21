import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { AppProprietiesService } from '@core/app-proprieties/app-proprieties.service';
import { UtilsService } from '@core/utils/utils.service';
import { Language } from '@core/enums/language.enum';
import { routeOpacity } from '@shared/animations/route-opacity';
import { MessageType } from '@core/enums/message-type.enum';
import { BackendService } from '@core/backend/backend.service';
import { EntryType } from '@core/enums/entry-type.enum';
import { Routine } from '@core/model/routine';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeOpacity]
})
export class AppComponent implements OnInit {
  constructor(
    public translateService: TranslateService,
    public storageService: AppStorageService,
    private appPropsService: AppProprietiesService,
    private utilsService: UtilsService,
    private router: Router,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.translateService.setDefaultLang(Language.BRAZILIAN_PORTUGUESE);
    this.defineChatBot();
    this.updateColorTheme();
    this.translateService.get('timeline').subscribe(items => {});
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.translateService.reloadLang(this.translateService.currentLang);
      }
    });
  }

  updateColorTheme() {
    this.router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        if (this.appPropsService.hasSelectedTerminal()) {
          this.utilsService.setColorTheme(
            this.storageService.getActiveTerminal().propertySelfServiceTerminal
              .backgroundColor
          );
        }
      }
    });
  }

  defineChatBot() {}

  goToConfirmationChoice() {}
}
