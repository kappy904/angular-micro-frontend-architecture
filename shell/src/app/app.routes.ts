import {loadRemoteModule} from '@angular-architects/module-federation';
import {Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },


  // Your route here:
  {
    path: 'mfe',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:1111/remoteEntry.js',
        remoteName: 'mfe1',
        exposedModule: './Module'
      })
        .then(m => m.AppModule)
  }
];

