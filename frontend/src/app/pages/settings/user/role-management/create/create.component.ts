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
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {

  modelId: any = '';
  errorMessage = '';
  successMessage = '';
  settingUp = true;
  successSetup = false;
  saving = false;

  permissionFormControl = new FormControl();

  roleName: any = '';
  user: any = [];
  installedApplications: any = [];
  permissions: any = [];
  permissionSelected: any = [];

  constructor(
    private route: ActivatedRoute,
    public permissionService: PermissionService,
    public location: Location
  ) {};

  async setup() {
      setTimeout(() => {
        this.setupSelectize();
      }, 200);
      this.settingUp = false;
      this.successSetup = true;
  }

  async setupSelectize() {
    setTimeout(() => {
      const permissionSelectize: any = $('#permission_selectize');
      permissionSelectize.selectize({
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
      });
    }, 200);
  }

  async save() {
    this.errorMessage = '';
    try {
      this.saving = true;

      const formData = {
        name: this.roleName,
        permissions: $("#permission_selectize").val(),
      };

      const res = await axios.post(`${environment.api_url}/settings/role-access-managements/store`, formData, {
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
      }, 1500);

      window.scrollTo(0, 0);
    } catch (error: any) {
      this.saving = false;
      console.log(error);

      this.errorMessage = 'Sorry, something went wrong. Please try again later.'
      window.scrollTo(0, 0);
    }
  }

  ngAfterViewInit() {
    const selectElement = document.getElementById('permission_selectize') as HTMLSelectElement;

    selectElement.addEventListener('change', () => {
      Array.from(selectElement.options).forEach(option => {
        if (option.selected) {
          option.style.backgroundColor = '#f59e0b';
          option.style.color = 'white';
        } else {
          option.style.backgroundColor = '';
          option.style.color = '';
        }
      });
    });
  }

  ngOnInit() {
    this.setup();
  }

}
