import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessManagementComponent } from './access-management.component';
import { RouterModule, Routes } from '@angular/router';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AccessManagementComponent
  }
]

@NgModule({
  declarations: [
    AccessManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginationModule,
    FormsModule
  ]
})
export class AccessManagementModule { }