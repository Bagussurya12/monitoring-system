import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { PermissionService } from 'src/app/services/permission/permission.service';
import * as $ from 'jquery';
import '@selectize/selectize';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {

  modelId: any = '';
  errorMessage = '';
  successMessage = '';
  settingUp = true;
  successSetup = false;
  userName = '';
  saving = false;

  permissionFormControl = new FormControl();

  user: any = [];
  installedApplications: any = [];
  roles: any = [];

  constructor(
    private route: ActivatedRoute,
    public permissionService: PermissionService,
    public location: Location
  ) {};

  async setup() {
    this.settingUp = true;

    try {
      const res = await axios.get(`${environment.api_url}/settings/user-access-managements/show/${this.modelId}`, {
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
      this.roles = data.roles;

      setTimeout(() => {
        this.setupSelectize();
      }, 200);

      this.successSetup = true;
    } catch (error) {
      console.log(error);
      this.errorMessage = 'Sorry, something went wrong. Please try again later.'
      this.settingUp = false;
    }
  }

  async setupSelectize() {
    const component = this
    setTimeout(() => {
      const el: any = $('#role_selectize');
      const roleSelectize = el.selectize({
        preload: true,
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        load: function (query: any, callback: any) {
          $("#fetching_role_id").show();
          $.ajax({
            url: `${environment.api_url}/settings/user-access-managements/get-all-roles?searchTerm=${query}`,
            type: 'GET',
            error: function() {
              callback();
              $("#fetching_role_id").hide();
            },
            success: function(res: any) {
              callback(res.roles.data);
              $("#fetching_role_id").hide();
            },
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem(environment.api_token_identifier)}`,
              'Content-Type': 'application/json',
            }
          });
        }
      })[0].selectize;

      const roleValues = new Array();
      this.roles.forEach((role: any) => {
        roleValues.push(role.id);
        roleSelectize.addOption(role);
      });

      roleSelectize.setValue(roleValues);
    }, 200);
  }

  hasRole(role: String) {
    if (role !== null
      && role !== undefined
      && role !== ''
      && this.roles.includes(role)
    ) {
        return true;
    }
    return false;
  }

  async save() {
    this.errorMessage = '';
    try {
      this.saving = true;

      const formData = {
        user_id: this.modelId,
        roles: [$('#role_selectize').val()],
      };

      const res = await axios.post(`${environment.api_url}/settings/user-access-managements/assign-role`, formData, {
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
      this.successMessage = data.message;

      setTimeout(() => {
        component.successMessage = '';
      }, 5000);

      window.scrollTo(0, 0);
      this.setup();

    } catch (error: any) {
      this.saving = false;
      console.log(error);

      this.errorMessage = 'Sorry, something went wrong. Please try again later.'
      window.scrollTo(0, 0);
    }
  }

  ngOnInit() {
    this.modelId = this.route.snapshot.params['id'];
    this.setup()
  }

}
