import { enableProdMode,importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import {AppComponent} from './app/app.component';
import {RouterModule} from '@angular/router';
import routes from './app/app-routing.module';
import { HttpClientModule } from '@angular/common/http'
import {bootstrapApplication} from '@angular/platform-browser';

  if (environment.production) {
    enableProdMode();
  }
  
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(
        RouterModule.forRoot(routes),
        HttpClientModule, 
      )
    ]
  })
    .catch(err => console.error(err));