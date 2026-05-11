import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { AdminComponent } from './pages/admin/admin.component';
import { WenginesComponent } from './pages/wengines/wengines.component';
import { DiscosComponent } from './pages/discos/discos.component';
import { BangboosComponent } from './pages/bangboos/bangboos.component';
import { authGuard } from './auth.guard';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
  { path: 'catalog', component: CatalogComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'wengines', component: WenginesComponent },
  { path: 'discos', component: DiscosComponent },
  { path: 'bangboos', component: BangboosComponent },
  // Zona Secreta Admin
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  // Aquí irá el Roster protegido en el futuro:
  // { path: 'roster', component: RosterComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/catalog', pathMatch: 'full' }
];
