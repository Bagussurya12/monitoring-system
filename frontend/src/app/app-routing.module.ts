import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IsNotLoggedInGuard } from './guards/is-not-logged-in-guard.guard';
import { NotFoundComponent } from './pages/Auth/not-found/not-found.component';

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

  { path: '**', pathMatch: 'full', component: NotFoundComponent, data: { layout: 'login' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
