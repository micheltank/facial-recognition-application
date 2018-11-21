import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppProprietiesService } from '@core/app-proprieties/app-proprieties.service';

@Injectable()
export class CanActivateTerminalDependantPage implements CanActivate {
  constructor(
    private router: Router,
    private appPropsService: AppProprietiesService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const canLoadTerminal =
      this.appPropsService.hasSelectedTerminal() &&
      this.appPropsService.isLoggedIn();
    if (!canLoadTerminal) {
      this.router.navigate(['login']);
    }

    return canLoadTerminal;
  }
}
