import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([]) // ✅ Gunakan forChild() untuk module feature
  ],
  exports: [NotFoundComponent] // Pastikan diekspor jika digunakan di luar module ini
})
export class NotFoundModule { }
