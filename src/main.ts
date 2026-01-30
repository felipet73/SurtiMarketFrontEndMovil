import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';


import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  pricetagsOutline,
  peopleOutline,
  leafOutline,
  createOutline,
  settingsOutline,
  trashOutline,
  bicycleOutline,
  flashOutline,
  waterOutline,
  cartOutline,
  chevronBackOutline,
  chevronForwardOutline,
  sendOutline,
  trophyOutline,
  personAddOutline
} from 'ionicons/icons';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';

addIcons({
  notificationsOutline,
  pricetagsOutline,
  peopleOutline,
  leafOutline,
  createOutline,
  settingsOutline,
  trashOutline,
  bicycleOutline,
  flashOutline,
  waterOutline,
  cartOutline,
  chevronBackOutline,
  chevronForwardOutline,
  sendOutline,
  trophyOutline,
  personAddOutline
});



bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // ✅ esto te faltaba
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
});
