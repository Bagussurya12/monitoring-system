import { Routes } from "@angular/router";
import { IsLoggedInGuard } from "src/app/guards/login/is-logged-in.guard";


export const routes: Routes = [
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
]