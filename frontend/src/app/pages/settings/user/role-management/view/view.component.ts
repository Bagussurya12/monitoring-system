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
  saving = false;

  permissionFormControl = new FormControl();

  roleName: any = '';
  role: any = [];
  installedApplications: any = [];
  permissions: any = [];
  permissionSelected: any = [];
  permissionSelectedArray: any = [];
  permissionCluster: any = [];

  constructor(
    private route: ActivatedRoute,
    public permissionService: PermissionService,
    public location: Location
  ) {};

  async setup() {
    this.settingUp = true;

    try {
      const res = await axios.get(`${environment.api_url}/settings/role-access-managements/show/${this.modelId}`, {
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

      this.roleName = data.role.name;
      this.permissionSelected = data.role.permissions;

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
      const el: any = $('#permission_selectize');
      const permissionSelectize = el.selectize({
        preload: true,
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        load: function (query: any, callback: any) {
          $("#fetching_permission_id").show();
          $.ajax({
            url: `${environment.api_url}/settings/role-access-managements/get-permissions?name=${query}`,
            type: 'GET',
            error: function() {
              callback();
              $("#fetching_permission_id").hide();
            },
            success: function(res: any) {
              callback(res.permissions.data);
              $("#fetching_permission_id").hide();
            },
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem(environment.api_token_identifier)}`,
              'Content-Type': 'application/json',
            }
          });
        },
        onChange: function() {
          const currentVal = $("#permission_selectize").val();
        }
      })[0].selectize;

      if (component.permissionSelected != undefined && component.permissionSelected != '') {
        let permissionIds = [];
        for (const line of component.permissionSelected) {
          permissionSelectize.addOption(line);
          permissionIds.push(line.id);
        }
        permissionSelectize.setValue(permissionIds);
      }
    }, 200);
  }

  async save() {
    this.errorMessage = '';
    try {
      this.saving = true;

      const formData = {
        name: this.roleName,
        permissions: $('#permission_selectize').val()
      };

      const res = await axios({
        method: 'PUT',
        url:  `${environment.api_url}/settings/role-access-managements/update/${this.modelId}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(environment.api_token_identifier)}`,
          "Content-Type": 'application/json',
          Accept: 'application/json'
        },
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
      }, 1500);

      window.scrollTo(0, 0);

    } catch (error: any) {
      this.saving = false;
      console.log(error);

      this.errorMessage = 'Sorry, something went wrong. Please try again later.'
      window.scrollTo(0, 0);
    }
  }

  ngOnInit() {
    this.modelId = this.route.snapshot.params['id'];
    this.setup();
  }
}
