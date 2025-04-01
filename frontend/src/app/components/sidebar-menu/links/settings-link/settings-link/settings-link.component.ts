import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PermissionService } from 'src/app/services/permission/permission.service';

@Component({
  selector: 'app-settings-link',
  templateUrl: './settings-link.component.html',
  styleUrls: ['./settings-link.component.scss']
})
export class SettingsLinkComponent implements OnInit {

  alert = alert;
  showSettingsSubmenu = false;
  showMasterDataSubMenu = false;
  showSystemSubmenu = false;
  showCartrackSubMenu = false;
  activeRoute = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public permissionService: PermissionService,
    private authService : AuthService,
  ) {}

  handleSettingsSubmenu() {
    this.showSettingsSubmenu = !this.showSettingsSubmenu;
  }

  logout() {
    if (confirm ('Are you sure you want to log out?')) {
      window.localStorage.removeItem(environment.api_token_identifier);
      this.authService.resetTwoFA();
      this.permissionService.removePermissions();
      this.authService.forgetResetPassword();
      this.authService.forgetQrCode();
      this.router.navigateByUrl('/login');
    }
  }

  showMasterDataSubmenus() {
    if (this.activeRoute.startsWith('/settings/users') ||
        this.activeRoute.startsWith('/settings/user-access-managements') ||
        this.activeRoute.startsWith('/settings/role-access-managements') ||
        this.activeRoute.startsWith('/settings')
    ) {
      this.showSettingsSubmenu = true;
      this.showMasterDataSubMenu = true;

      if (this.activeRoute.startsWith('/settings/users') ||
        this.activeRoute.startsWith('/settings/user-access-managements') ||
        this.activeRoute.startsWith('/settings/role-access-managements')
      ) {
        this.showSystemSubmenu = true;
      }

    }
  }

  incommingModuleClicked() {
    alert('Please install this module to continue')
  }

  ngOnInit() {
    this.activeRoute = this.router.url;
    this.showMasterDataSubmenus();

    if (this.activeRoute.startsWith('/settings')) {
      this.showSettingsSubmenu = true;
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map(route => {
        while (route.firstChild) route = route.firstChild
        return route
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }
}
