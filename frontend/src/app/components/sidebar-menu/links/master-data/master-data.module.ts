import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataComponent } from './master-data.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MasterDataComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    MasterDataComponent
  ]
})
export class MasterDataModule { }
