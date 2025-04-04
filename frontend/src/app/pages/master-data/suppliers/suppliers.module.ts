import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SuppliersComponent } from './suppliers.component';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: SuppliersComponent
  }
]

@NgModule({
  declarations: [
    SuppliersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginationModule,
    FormsModule
  ]
})
export class SuppliersModule { }
