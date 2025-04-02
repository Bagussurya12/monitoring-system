import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundModule } from './pages/Auth/not-found/not-found.module';
import { SettingsLinkModule } from './components/sidebar-menu/links/settings-link/settings-link/settings-link.module';
import { CountriesComponent } from './pages/master-data/countries/countries.component';
import { CreateComponent } from './pages/master-data/countries/create/create.component';
import { ViewComponent } from './pages/master-data/countries/view/view.component';


@NgModule({
  declarations: [
    AppComponent,
    CountriesComponent,
    CreateComponent,
    ViewComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientModule,
    SettingsLinkModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
