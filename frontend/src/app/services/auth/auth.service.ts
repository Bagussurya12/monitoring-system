import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PermissionService } from '../permission/permission.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    public permissionService: PermissionService
  ) { }

  isAuthenticated(): boolean {
    const token = window.localStorage.getItem(environment.api_token_identifier);
    return token !== undefined && token !== null && token !== '';
  }

  logout(){
    window.localStorage.removeItem(environment.api_token_identifier);
    this.permissionService.removePermissions();
    this.router.navigateByUrl('/login');
  }

  public getToken(): string|null {
    return localStorage.getItem(environment.api_token_identifier)
  }

  public rememberToken(token: string): void {
    localStorage.setItem(environment.api_token_identifier, token);
  }

  public forgetToken(): void {
    localStorage.removeItem(environment.api_token_identifier);
  }

  completeTwoFA(): void {
    localStorage.setItem('2fa_verified', 'true');
  }

  resetTwoFA(): void {
    localStorage.removeItem('2fa_verified');
  }

  is2FAVerified(): boolean {
    return localStorage.getItem('2fa_verified') === 'true';
  }

  isResetPassword(): boolean {
    return localStorage.getItem('password_reset') === 'true';
  }

  completeResetPassword(reset: boolean = true) {
    if (reset) {
      localStorage.setItem('password_reset', 'true');
    } else {
      localStorage.setItem('password_reset', 'false');
    }
  }

  forgetResetPassword(): void {
    localStorage.removeItem('password_reset');
  }

  forgetQrCode(): void {
    localStorage.removeItem('qrCode');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(environment.api_token_identifier);
  }
}
