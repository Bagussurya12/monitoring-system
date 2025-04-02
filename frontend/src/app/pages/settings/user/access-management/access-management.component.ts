import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.scss']
})
export class AccessManagementComponent {
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

  name_search: any = '';
  username_search: any = '';

  constructor(
    private router: Router,
    private activatedRoute : ActivatedRoute,
  ) {};

  viewUser(user: any) {
    this.router.navigateByUrl('/settings/user-access-managements/view/' + user.id);
  }

  async getUsers() {
    this.loading = true;
    let url = `${environment.api_url}/settings/user-access-managements?page=${this.page}`;

    if(this.name_search != null && this.name_search != undefined && this.name_search != '') {
      url = url + `&name=${this.name_search}`;
    }

    if(this.username_search != null && this.username_search != undefined && this.username_search != '') {
      url = url + `&username=${this.username_search}`;
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

  selectedPage(page: any) {
    this.page = page;
    this.getUsers();
  }

  ngOnInit() {
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
