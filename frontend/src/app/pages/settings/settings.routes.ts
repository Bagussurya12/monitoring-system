import { Routes } from "@angular/router";
import { IsLoggedInGuard } from "src/app/guards/login/is-logged-in.guard";


export const routes: Routes = [

    //------------------------------- User Management ------------------------------- //
    {
      path: 'settings/users/user-management',
      loadChildren: () => import('./user/user-management/user-management.module').then(m => m.UsersModule),
      data: {
          layout: 'app'
      },
      canActivate: [
          IsLoggedInGuard,
      ]
    },
    {
      path: 'settings/users/user-management/create',
      loadChildren: () => import('./user/user-management/create/create.module').then(m => m.CreateModule),
      data: {
          layout: 'app'
      },
      canActivate: [
          IsLoggedInGuard,
      ]
    },
    {
      path: 'settings/users/user-management/view/:id',
      loadChildren: () => import('./user/user-management/view/view.module').then(m => m.ViewModule),
      data: {
          layout: 'app'
      },
      canActivate: [
          IsLoggedInGuard,
      ]
    },

    //------------------------------- User Management ------------------------------- //

    {
      path: 'settings/users/role-managements',
      loadChildren: () => import('./user/role-management/role-management.module').then(m => m.RoleManagementModule),
      data: {
          layout: 'app'
      },
      canActivate: [
          IsLoggedInGuard,
      ]
    },
]