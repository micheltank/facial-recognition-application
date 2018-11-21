import { Component, OnInit } from '@angular/core';
import { AppEventsService } from '@core/app-events/app-events.service';
import { TranslateService } from '@ngx-translate/core';
import { FullscreenDisableDetectorService } from '@core/fullscreen-disable-detector/fullscreen-disable-detector.service';
import { UserActivityDetectorService } from '@core/user-activity-detector/user-activity-detector.service';
import { AppStorageService } from '@core/app-storage/app-storage.service';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-errors-handler',
  templateUrl: './app-errors-handler.component.html',
  styleUrls: ['./app-errors-handler.component.scss']
})
export class AppErrorsHandlerComponent implements OnInit {
  private static readonly COUNTDOWN_VALUE = 15;
  private static readonly INACTIVITY_TIME = 20000;
  public netErrTitle: string;
  public subtitleErr: string;
  public contentErr: string;
  public showNetErrorDialog: boolean;
  public showInactivityDialog: boolean;
  public showWindowedDialog: boolean;
  public countdownValue = AppErrorsHandlerComponent.COUNTDOWN_VALUE;
  public countdownInactivity = AppErrorsHandlerComponent.COUNTDOWN_VALUE;
  private httpStatusCode: number;
  private routerEventsSubscription: Subscription;
  private userAttemps = 0;

  constructor(
    public appEvents: AppEventsService,
    public translate: TranslateService,
    public fullscreenDisableDetectorService: FullscreenDisableDetectorService,
    public userActivityDetectorService: UserActivityDetectorService,
    public appStorageService: AppStorageService,
    public router: Router
  ) {}

  ngOnInit() {
    this.registerAppRouteChildsErrorsHandlers();
    this.registerGlobalErrorsHandlers();
    this.resetUserAttempsOnNavigation();
  }

  private resetUserAttempsOnNavigation() {
    this.router.events.subscribe(routerEvent => {
      if (routerEvent instanceof NavigationEnd) {
        this.userAttemps = 0;
      }
    });
  }

  private registerGlobalErrorsHandlers() {
    this.appEvents.onGenericNetworkError().subscribe(httpRes => {
      this.translate
        .get('app-errors-handler.title-generic-neterr')
        .subscribe(val => (this.netErrTitle = val));
      this.showDialog('network');
    });

    this.appEvents.onNetworkError5xx().subscribe(httpRes => {
      this.netErrTitle = this.translate.instant(
        'app-errors-handler.title-generic-neterr'
      );
      this.handleGenericError(httpRes);
    });

    this.appEvents.onNetworkError4xx().subscribe(httpRes => {
      if (httpRes && httpRes.status) {
        this.httpStatusCode = httpRes.status;
        if (
          httpRes.url.includes('dictionary') ||
          httpRes.url.includes('dicionario') ||
          httpRes.url.includes('null')
        ) {
          return;
        }
        switch (this.httpStatusCode) {
          case 400:
            this.netErrTitle = this.translate.instant(
              'app-errors-handler.title-generic-neterr'
            );
            this.subtitleErr = '';
            this.contentErr = this.translate.instant(
              'app-errors-handler.content-neterr'
            );
            this.showDialog('network');
            break;
          case 401:
            if (httpRes.url.endsWith('login')) {
              this.netErrTitle = this.translate.instant(
                'app-errors-handler.title-generic-neterr'
              );
              this.subtitleErr = this.translate.instant(
                'app-errors-handler.subtitle-invalid-credential'
              );
              this.contentErr = this.translate.instant(
                'app-errors-handler.content-invalid-credential'
              );
            } else {
              this.netErrTitle = this.translate.instant(
                'app-errors-handler.title-autherr'
              );
              this.subtitleErr = '';
              this.contentErr = this.translate.instant(
                'app-errors-handler.content-autherr'
              );
            }
            this.showDialog('network');
            break;
          default:
            this.handleGenericError(httpRes);
            break;
        }
      } else {
        this.handleGenericError(httpRes);
      }
    });
  }

  private handleGenericError(httpRes) {
    this.netErrTitle = this.translate.instant(
      'backend-errors.title.' + httpRes.error.code
    );
    this.subtitleErr = this.translate.instant(
      'backend-errors.subtitle.' + httpRes.error.code
    );
    this.contentErr = this.translate.instant(
      'app-errors-handler.content-neterr'
    );

    if (httpRes.error.code === 'SELF_SERVICE_TERMINAL_WITHOUT_ID') {
      this.router.navigate(['available-terminals']);
      return;
    }

    if (httpRes.error.code === 'INVALID_USER_AND_PASSWORD') {
      this.contentErr = this.translate.instant('app-errors-handler.try-again');
      this.handleUserAttemps();
    } else if (
      httpRes.error.code === 'SELF_SERVICE_TERMINAL_NOT_FOUND_BY_ID' ||
      httpRes.error.code === 'SELF_SERVICE_TERMINAL_IS_DISABLED' ||
      httpRes.error.code === 'SELF_SERVICE_TERMINAL_IN_USE'
    ) {
      localStorage.clear();
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['app', 'home']);
    }
    this.showDialog('network');
  }

  private registerAppRouteChildsErrorsHandlers() {
    this.routerEventsSubscription = this.router.events.subscribe(
      routerEvent => {
        if (
          routerEvent instanceof NavigationEnd &&
          routerEvent.urlAfterRedirects.startsWith('/app/')
        ) {
          if (environment.production) {
            this.userActivityDetectorService.start(
              AppErrorsHandlerComponent.INACTIVITY_TIME
            );
            this.fullscreenDisableDetectorService.start();

            this.userActivityDetectorService
              .onInactivity()
              .subscribe(inactivityTime => {
                this.showDialog('inactivity');
              });

            // quando detectar atividade do usuário deve reiniciar o contador
            // de fechamento do dialog e esconder o dialog de inatividade
            this.userActivityDetectorService.onActivity().subscribe(evt => {
              this.countdownInactivity =
                AppErrorsHandlerComponent.COUNTDOWN_VALUE;
              this.showInactivityDialog = false;
            });

            this.fullscreenDisableDetectorService
              .onFullscreenDisabled()
              .subscribe(() => {
                this.showDialog('windowed');
              });
          }
          this.routerEventsSubscription.unsubscribe();
        }
      }
    );
  }

  private handleUserAttemps() {
    const activeTerminal = this.appStorageService.getActiveTerminal();
    if (
      activeTerminal.propertySelfServiceTerminal
        .searchAttemptsPersonByUserAndPassword !== 0
    ) {
      this.userAttemps++;
      if (
        activeTerminal.propertySelfServiceTerminal
          .searchAttemptsPersonByUserAndPassword <= this.userAttemps
      ) {
        this.userAttemps = 0;
        this.contentErr = this.translate.instant(
          'app-errors-handler.content-neterr'
        );
        this.router.navigate(['app', 'home']);
      }
    }
  }

  closeInactivityDialog() {
    this.showInactivityDialog = false;
    this.router.navigate(['app', 'home']);
  }

  closeNetErrDialog() {
    this.showNetErrorDialog = false;
    this.countdownValue = AppErrorsHandlerComponent.COUNTDOWN_VALUE;

    if (this.httpStatusCode === 401) {
      this.router.navigate(['login']);
      this.httpStatusCode = undefined;
    }
  }

  requestFullScreen() {
    this.fullscreenDisableDetectorService.requestFullscreen();
    this.closeDialogs();
  }

  private showDialog(dialog: 'network' | 'inactivity' | 'windowed') {
    // erros de network tem prioridade sobre todos, por isso sempre será exibido
    if (dialog === 'network') {
      this.showInactivityDialog = false;
      this.showWindowedDialog = false;
      this.showNetErrorDialog = true;
    }

    // erros de inatividade e fullscreen tem menos prioridade que erros de rede
    // por isso são exibidos apenas quando não há erro de rede sendo exibido
    if (dialog === 'windowed' && !this.showNetErrorDialog) {
      this.showInactivityDialog = false;
      this.showWindowedDialog = true;
    }

    // erro de inatividade só deve ser exibido se o erro de windowed e rede
    // não estiverem sendo exibidos
    if (
      dialog === 'inactivity' &&
      !this.showNetErrorDialog &&
      !this.showWindowedDialog
    ) {
      this.showInactivityDialog = true;
      this.showWindowedDialog = false;
    }
  }

  private closeDialogs() {
    this.showInactivityDialog = false;
    this.showWindowedDialog = false;
    this.showNetErrorDialog = false;
  }
}
