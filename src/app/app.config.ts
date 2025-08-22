import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NgxUiLoaderConfig, NgxUiLoaderModule, NgxUiLoaderService, PB_DIRECTION, SPINNER } from 'ngx-ui-loader';
import { routes } from './app-routes';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: "Loading...",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  pbColor:"#2e0808",
  bgsColor:"#2e0808",
  fgsColor:"#2e0808",
  fgsType: SPINNER.threeStrings,
  fgsSize: 100,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: NgxUiLoaderService, useClass: NgxUiLoaderService }
  ]
};