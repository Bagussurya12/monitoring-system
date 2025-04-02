import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent {
  loading = false;
  page = 1;
  errorMessage = '';
  successMessage = '';
  roleProfiles: any = [];
  roles: any = [];
  totalItems = 0;

  name: any = '';
  permissions: any = [];
  permission: any = '';
  showDeleteModal: boolean = false;
  selectedRole : any = null;

  name_search: any = '';
  permission_search: any = '';

  constructor(
    private router: Router,
    private activatedRoute : ActivatedRoute,
  ) {};

  viewRole(role: any) {
    this.router.navigateByUrl('/settings/users/role-managements/view/' + role.id);
  }

  async deleteRole(role: any) {
    this.errorMessage = '';
    this.successMessage = '';

      this.loading = true;
      try {
        const res = await axios.delete(`${environment.api_url}/settings/role-access-managements/destroy/${role.id}`, {
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

        this.successMessage = 'Successfully deleted role!';
        const component = this;
        setTimeout(() => {
          component.successMessage = '';
        }, 1500);
        window.scrollTo(0,0);
        this.loading = false;
        this.getRoles();
      } catch (error) {
        this.loading = false;
        this.errorMessage = 'Sorry, something went wrong. Please try again later!';
      }
  }

  async getRoles() {
    this.loading = true;
    let url = `${environment.api_url}/settings/role-access-managements?page=${this.page}`;

    if(this.name_search != null && this.name_search != undefined && this.name_search != '') {
      url = url + `&name=${this.name_search}`;
    }

    if(this.permission_search != null && this.permission_search != undefined && this.permission_search != '') {
      url = url + `&permission=${this.permission_search}`;
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

      this.roles = data.roles.data;

      this.totalItems = data.roles.total;
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.errorMessage = 'Sorry, something went wrong. Please try again later!';
      this.loading = false;
    }
  }

  selectedPage(page: any) {
    this.page = page;
    this.getRoles();
  }

  confirmDelete(){
    if(this.selectedRole){
      this.deleteRole(this.selectedRole)
    }
    this.closeModal();
  }

  openDeleteModal(role: any){
    this.selectedRole = role;
    this.showDeleteModal = true;
  }

  closeModal() {
    this.selectedRole = null;
    this.showDeleteModal = false;
  }

  ngOnInit() {
    this.getRoles();

    this.activatedRoute.queryParams.subscribe(params => {
      let page = params['page'];
      if(page == undefined || page == null || page == '') {
        return;
      }
      this.page = page;
      this.getRoles();
    });
  }
}
