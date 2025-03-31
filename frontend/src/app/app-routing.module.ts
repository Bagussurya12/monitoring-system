import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/Auth/not-found/not-found.component';
import { IsLoggedInGuard } from './guards/login/is-logged-in.guard';
import { IsNotLoggedInGuard } from './guards/is-not-logged-in-guard.guard';


function protectRoutes(routes: Routes): Routes {
  return routes.map(route => ({
    ...route,
    canActivate: route.canActivate ? [...route.canActivate, ] : []
  }));
}

const protectedRoutes: Routes = protectRoutes([

]);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/Auth/login/login.module').then(m => m.LoginModule),
    data: { layout: 'login' },
    canActivate: [IsNotLoggedInGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/Auth/login/login.module').then(m => m.LoginModule),
    data: { layout: 'login' },
    canActivate: [IsNotLoggedInGuard]
  },


  // {
  //   path: 'home',
  //   loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
  //   data: { layout: 'app' },
  //   canActivate: [IsLoggedInGuard, PasswordChangedGuard, ResetPasswordUserGuard, TwoFAGuard]
  // },

  ...protectedRoutes,

  { path: '**', pathMatch: 'full', component: NotFoundComponent, data: { layout: 'login' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
