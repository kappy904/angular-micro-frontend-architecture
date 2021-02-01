import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {APP_ROUTES} from './app.routes';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
