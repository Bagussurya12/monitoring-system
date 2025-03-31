import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';  // Pastikan mengimpor AppModule

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
