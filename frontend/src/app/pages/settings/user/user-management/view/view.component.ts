import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import axios from 'axios';
import { PermissionService } from 'src/app/services/permission/permission.service';
import { environment } from 'src/environments/environment';
import '@selectize/selectize';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  @Input() modelId: any = '';

  errorMessage = '';
  successMessage = '';
  settingUp = true;
  successSetup = false;
  saving = false;

  user: any = [];
  name: any = '';
  username: any = '';
  password: any = '';
  confirmation_password: any = '';

  constructor(
    private route: ActivatedRoute,
    public permissionService: PermissionService,
    public location: Location
  ) { }

  async save() {
    this.errorMessage = '';

    try {
      this.saving = true;
      const formData = {
        id: this.modelId,
        name: this.user.name,
        username: this.user.username,
        password: this.password,
        password_confirmation: this.confirmation_password,
      };

      const res = await axios.put(`${environment.api_url}/settings/users/${this.modelId}`, formData, {
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

      const component = this;
      this.successMessage = 'Succesfully updated user!';
      this.password = '';
      this.confirmation_password = '';

      setTimeout(() => {
        component.successMessage = '';
      }, 1500);

      window.scrollTo(0, 0);
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

  async setup() {
    this.settingUp = true;

    try {
      const res = await axios.get(`${environment.api_url}/settings/users/${this.modelId}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(environment.api_token_identifier)}`
        }
      });
      const data = await res.data;
      this.settingUp = false;
      if (data.error) {
        this.errorMessage = data.error_message;
        window.scrollTo(0,0);
        return;
      }

      this.user = data.user;
      this.successSetup = true;
    } catch (error) {
      console.log(error);
      this.errorMessage = 'Sorry, something went wrong. Please try again later.'
      this.settingUp = false;
    }
  }

  ngOnInit(): void {
    this.modelId = this.route.snapshot.params['id'];
    this.setup();

    // Get the query param if any
    this.route.queryParams.subscribe(params => {
      const success = params['success'];
      const successType = params['success_message'];

      if (success !== null && success !== undefined && successType !== null && successType !== undefined) {
        if (successType == 'created') {
          this.successMessage = 'Successfully created user!';
          const component = this;
          setTimeout(() => {
            component.successMessage = '';
          }, 1500);
        }
      }
    });
  }

}
