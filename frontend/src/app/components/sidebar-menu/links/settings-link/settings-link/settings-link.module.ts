import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsLinkComponent } from './settings-link.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SettingsLinkComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    SettingsLinkComponent
  ]
})
export class SettingsLinkModule { }
