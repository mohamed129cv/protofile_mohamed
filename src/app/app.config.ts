import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(routes  ),
     provideClientHydration() ,
     provideAnimations() ,
     provideHttpClient(withInterceptors([loadingInterceptor])) ,
     importProvidersFrom(BrowserAnimationsModule) ,
    provideToastr({
      timeOut: 2500 ,
      closeButton : true ,
      progressBar : true ,
      progressAnimation : 'increasing' ,
      positionClass : 'toast-top-right' ,
      tapToDismiss : true
    })
  ]
};
