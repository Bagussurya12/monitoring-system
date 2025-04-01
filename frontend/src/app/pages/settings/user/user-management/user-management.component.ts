import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { PermissionService } from 'src/app/services/permission/permission.service';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UsersComponent implements OnInit {
  loading = false;
  page = 1;
  errorMessage = '';
  successMessage = '';
  userProfiles: any = [];
  users: any = [];
  totalItems = 0;

  name: any = '';
  username: any = '';
  position: any = '';
  employee_number: any = '';

  name_search: any = '';
  username_search: any = '';
  position_search: any = '';
  employee_number_search: any = '';
  actionType: string = '';
  modalUsers : any = [];

  showResetModal: boolean = false;
  selectedUser: any = null;

  successState: string = ''
  success: boolean = false;
  isLoading: boolean = false;


  debounceGetUser: any;

  constructor(
    private router: Router,
    private activatedRoute : ActivatedRoute,
    public permissionService: PermissionService,
    public __apiService: ApiService,
  ) {
  }

  viewUser(user: any) {
    this.router.navigateByUrl('/settings/users/view/' + user.id + '?tab=user_details');
  }

  async getUsers() {
    clearTimeout(this.debounceGetUser);

    this.debounceGetUser = setTimeout(() => {
      this._getUsers();
    }, 200);
  }

  async _getUsers() {
    this.loading = true;
    let url = `${environment.api_url}/settings/users?page=${this.page}`;

    if(this.name_search != null && this.name_search != undefined && this.name_search != '') {
      url = url + `&name=${this.name_search}`;
    }

    if(this.username_search != null && this.username_search != undefined && this.username_search != '') {
      url = url + `&username=${this.username_search}`;
    }

    if(this.employee_number_search != null && this.employee_number_search != undefined && this.employee_number_search != '') {
      url = url + `&employee_number=${this.employee_number_search}`;
    }

    if(this.position_search != null && this.position_search != undefined && this.position_search != '') {
      url = url + `&position=${this.position_search}`;
    }

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(environment.api_token_identifier)}`,
          "Content-Type": 'application/json',
          Accept: 'application/json'
        }
      });
      const data = await res.data;
      if (data.error) {
        this.errorMessage = data.error_message;
        window.scrollTo(0,0);
        return;
      }

      this.users = data.users.data;
      this.totalItems = data.users.total;
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.errorMessage = 'Sorry, something went wrong. Please try again later!';
      this.loading = false;
    }
  }

  async resetTwoFa(user: any) {
    this.errorMessage = '';
    this.successMessage = '';
    this.__apiService.post(`${environment.api_url}/settings/users/reset-two-fa/${user.id}`)
    .then((response: any) => {
      const responseData = response.data;
      if (responseData.error) {
        console.error(responseData.error);
        this.errorMessage = responseData.error_message;
        return;
      }
      this.successMessage = 'Successfully Reset 2FA user!';
      const component = this;
      setTimeout(() => {
        component.successMessage = '';
      }, 1500);
      this.getUsers();
    })
    .catch(error => {
      console.error(error)
      if (error.response.status === 422 || error.response.status === '422') {
        const errorData = error.response.data.errors;

        let firstError = '';
        Object.keys(errorData).forEach(errorKey => {
          if (firstError.length <= 0) {
            firstError = errorData[errorKey][0];
          }
        });

        this.errorMessage = firstError;
      } else {
        this.errorMessage = 'Sorry, something went wrong. Please try again later.';
      }
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    })
  }

  async delete(user: any) {
    this.errorMessage = '';
    this.successMessage = '';
    if (confirm('Are you sure you want to delete this user?')) {
      this.loading = true;
      try {
        const res = await axios.delete(`${environment.api_url}/settings/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(environment.api_token_identifier)}`,
            "Content-Type": 'application/json',
            Accept: 'application/json'
          }
        });
        const data = await res.data;
        if (data.error) {
          this.loading = false;
          this.errorMessage = data.error_message;
          window.scrollTo(0,0);
          return;
        }

        this.successMessage = 'Successfully deleted user!';
        const component = this;
        setTimeout(() => {
          component.successMessage = '';
        }, 1500);
        this.getUsers();
      } catch (error) {
        this.loading = false;
        console.log(error);
        this.errorMessage = 'Sorry, something went wrong. Please try again later!';
      }
    }
  }

  async export() {
    this.loading = true;

    const formData = {
      name: this.name,
      username: this.username,
      position: this.position,
      employee_number: this.employee_number
    }

    try {
      const res = await axios.post(`${environment.api_url}/settings/user/generate-user-export-token`, formData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(environment.api_token_identifier)}`,
          "Content-Type": 'application/json',
          Accept: 'application/json'
        }
      });
      const data = await res.data;
      if (data.error) {
        this.errorMessage = data.error_message;
        window.scrollTo(0,0);
        return;
      }

      const url = data.print_url;
      window.open(url, '_blank');

      this.loading = false;
    } catch (error) {
      console.log(error);
      this.errorMessage = 'Sorry, something went wrong. Please try again later!';
      this.loading = false;
    }
  }

  selectedPage(page: any) {
    this.page = page;
    this.getUsers();
  }

  openResetModal(user: any) {
    this.selectedUser = user;
    this.showResetModal = true;
  }

  closeModal() {
    this.showResetModal = false;
    this.selectedUser = null;
  }

  confirmReset() {
    if (this.selectedUser) {
      this.resetTwoFa(this.selectedUser);
    }
    this.closeModal();
  }

  ngOnInit(){
    this.getUsers();

    this.activatedRoute.queryParams.subscribe(params => {
      let page = params['page'];
      if(page == undefined || page == null || page == '') {
        return;
      }
      this.page = page;
      this.getUsers();
    });
  }
}
