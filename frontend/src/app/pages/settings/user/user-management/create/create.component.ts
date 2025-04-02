import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { PermissionService } from 'src/app/services/permission/permission.service';
import { environment } from 'src/environments/environment'
import { Location } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  errorMessage = '';
  settingUp = false;
  successSetup = false;
  saving = false;

  name: any = '';
  username: any = '';
  password: any = '';
  confirmation_password = '';

  constructor(
    private router: Router,
    public permissionService: PermissionService,
    public location: Location
  ) { }

  async save() {
    this.errorMessage = '';
    try {
      this.saving = true;

      const formData = {
        name: this.name,
        username: this.username,
        password: this.password,
        password_confirmation: this.confirmation_password,
      };

      const res = await axios.post(`${environment.api_url}/settings/users`, formData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(environment.api_token_identifier)}`,
          "Content-Type": 'application/json',
          Accept: 'application/json'
        }
      });
      const data = await res.data;
      this.saving = false;

      if (data.error) {
        this.errorMessage = data.error_message;
        window.scrollTo(0,0);
        return;
      }

      this.router.navigateByUrl(`/settings/users/user-management/view/${data.user.id}?success=true&success_message=created`);
    } catch (error: any) {
      this.saving = false;
      console.log(error);

      if (error.response.status == 422) {
        Object.keys(error.response.data.errors).forEach(key => {
          if (this.errorMessage === null || this.errorMessage === undefined || this.errorMessage.length <= 0) {
            this.errorMessage = error.response.data.errors[key];
          }
        });
      } else {
        this.errorMessage = 'Sorry, something went wrong. Please try again later.'
      }

      window.scrollTo(0, 0);
    }
  }
}
