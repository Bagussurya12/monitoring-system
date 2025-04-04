import { Routes } from "@angular/router";
import { IsLoggedInGuard } from "src/app/guards/login/is-logged-in.guard";


export const routes: Routes = [
  {
    path: 'master-data/supplier',
    loadChildren: () => import('./suppliers/suppliers.module').then(m => m.SuppliersModule),
    data: {
        layout: 'app'
    },
    canActivate: [
        IsLoggedInGuard,
    ]
  },
  {
    path: 'master-data/supplier/create',
    loadChildren: () => import('./suppliers/create/create.module').then(m => m.CreateModule),
    data: {
        layout: 'app'
    },
    canActivate: [
        IsLoggedInGuard,
    ]
  },
  {
    path: 'master-data/supplier/view/:id',
    loadChildren: () => import('./suppliers/view/view.module').then(m => m.ViewModule),
    data: {
        layout: 'app'
    },
    canActivate: [
        IsLoggedInGuard,
    ]
  },
]