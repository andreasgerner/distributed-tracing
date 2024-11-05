import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter, Routes } from "@angular/router";
import { HomeComponent } from "../lib/home/home.component";
import { DetailsComponent } from "../lib/details/details.component";
import { DetailsResolver } from "../lib/details/details.resolver";
import { HomeResolver } from "../lib/home/home.resolver";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    resolve: {
      companies: HomeResolver
    }
  },
  {
    path: ":id",
    component: DetailsComponent,
    runGuardsAndResolvers: "always",
    resolve: {
      company: DetailsResolver
    }
  }
]

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}), provideHttpClient(), provideRouter(routes)]
};
