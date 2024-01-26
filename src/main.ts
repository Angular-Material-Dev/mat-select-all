import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// needed for stackblitz
// import 'zone.js';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
