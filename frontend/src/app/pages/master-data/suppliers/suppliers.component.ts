import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { PermissionService } from 'src/app/services/permission/permission.service';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  loading = false;
  page = 1;
  errorMessage = '';
  successMessage = '';
  suppliers: any = [];
  totalItems = 0;

  supplier_name: any = ''
  supplier_code: any = ''
  supplier_category: any = ''

  showResetModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedSupplier: any = null;

  successState: string = ''
  success: boolean = false;
  isLoading: boolean = false;

 debounceGetSupplier: any;


 constructor(
      private router: Router,
      private activatedRoute : ActivatedRoute,
      public permissionService: PermissionService,
      public __apiService: ApiService,
   ) {
  }

  viewSupplier(supplier: any) {
    this.router.navigateByUrl('/master-data/supplier/view/' + supplier.id);
  }

  async getSuppliers() {
    clearTimeout(this.debounceGetSupplier);

    this.debounceGetSupplier = setTimeout(() => {
      this._getSuppliers();
    }, 200);
  }

  async _getSuppliers() {
    this.loading = true;
    let url = `${environment.api_url}/master-data/supplier?page=${this.page}`;

    if(this.supplier_name != null && this.supplier_name != undefined && this.supplier_name != '') {
      url = url + `&supplier_name=${this.supplier_name}`;
    }

    if(this.supplier_code != null && this.supplier_code != undefined && this.supplier_code != '') {
      url = url + `&supplier_code=${this.supplier_code}`;
    }

    if(this.supplier_category != null && this.supplier_category != undefined && this.supplier_category != '') {
      url = url + `&supplier_category=${this.supplier_category}`;
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

      this.suppliers = data.suppliers.data;
      this.totalItems = data.suppliers.total;
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.errorMessage = 'Sorry, something went wrong. Please try again later!';
      this.loading = false;
    }
  }

  async delete(supplier: any) {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

      try {
        const res = await axios.delete(`${environment.api_url}/master-data/supplier/delete/${supplier.id}`, {
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
        this.getSuppliers();
      } catch (error) {
        this.loading = false;
        console.log(error);
        this.errorMessage = 'Sorry, something went wrong. Please try again later!';
      }
  }

  selectedPage(page: any) {
    this.page = page;
    this.getSuppliers();
  }

  openDeleteModal(supplier: any){
    this.selectedSupplier = supplier;
    this.showDeleteModal = true;
  }

  closeModal() {
    this.showDeleteModal = false;
    this.selectedSupplier = null;
  }

  confirmDelete(){
    if(this.selectedSupplier){
      this.delete(this.selectedSupplier)
    }
    this.closeModal();
  }

  ngOnInit(){
    this.getSuppliers();

    this.activatedRoute.queryParams.subscribe(params => {
      let page = params['page'];
      if(page == undefined || page == null || page == '') {
        return;
      }
      this.page = page;
      this.getSuppliers();
    });
  }
}
