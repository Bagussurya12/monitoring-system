import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from './guards/login/is-logged-in.guard';
import { IsNotLoggedInGuard } from './guards/is-not-logged-in-guard.guard';
import { NotFoundComponent } from './pages/Auth/not-found/not-found.component';
import { LoginComponent } from './pages/Auth/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/Auth/login/login.module').then(m => m.LoginModule),
    data: { layout: 'login' },
    canActivate: [IsNotLoggedInGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
