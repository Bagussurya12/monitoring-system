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

  supplier_name: any = '';
  supplier_code: any = '';
  contact_person: any = '';
  phone_number: any = '';
  email: any = '';
  address: any = '';
  city: any = '';
  province: any = '';
  postal_code: any = '';
  supplier_category: any = '';

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
        supplier_name: this.supplier_name,
        supplier_code: this.supplier_code,
        constact_person: this.contact_person,
        phone_number: this.phone_number,
        email: this.email,
        address: this.address,
        city: this.city,
        province: this.province,
        postal_code: this.postal_code,
        supplier_category: this.supplier_category,
      };

      const res = await axios.post(`${environment.api_url}/master-data/supplier/store`, formData, {
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

      this.router.navigateByUrl(`/master-data/supplier/view/${data.supplier.id}?success=true&success_message=created`);
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
