import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ResetDataService } from './app/shared/reset-service'; 

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    // On force le reset à chaque lancement
    const resetService = new ResetDataService();
  })
  .catch(err => console.error(err));