import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, SPINNER } from 'ngx-ui-loader';
import { routes } from './app-routes';
import { provideAnimations } from '@angular/platform-browser/animations';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: "Loading...",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  pbColor: "#0c2549ff",
  bgsColor: "#1f2937",
  fgsColor: "#061427ff",
  fgsType: SPINNER.threeStrings,
  fgsSize: 100,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
     provideAnimations(),
    importProvidersFrom(NgxUiLoaderModule.forRoot(ngxUiLoaderConfig))
  ]
};
