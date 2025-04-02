import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundModule } from './pages/Auth/not-found/not-found.module';
import { SettingsLinkModule } from './components/sidebar-menu/links/settings-link/settings-link/settings-link.module';
import { MasterDataModule } from './components/sidebar-menu/links/master-data/master-data.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientModule,
    SettingsLinkModule,
    MasterDataModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
