import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { AdminComponent } from './pages/admin/admin.component';
import { WenginesComponent } from './pages/wengines/wengines.component';
import { DiscosComponent } from './pages/discos/discos.component';
import { BangboosComponent } from './pages/bangboos/bangboos.component';
import { AgentDetailComponent } from './pages/agent-detail/agent-detail.component';
import { TierListComponent } from './pages/tier-list/tier-list.component';
import { RosterComponent } from './pages/roster/roster.component';
import { authGuard } from './auth.guard';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
  { path: 'agentes', component: CatalogComponent, title: 'ZZZAcademy - Agentes' },
  { path: 'agent/:id', component: AgentDetailComponent, title: 'ZZZAcademy - Detalles de Agente' },
  { path: 'login', component: LoginComponent, title: 'ZZZAcademy - Iniciar Sesión' },
  { path: 'register', component: RegisterComponent, title: 'ZZZAcademy - Registrarse' },
  { path: 'wengines', component: WenginesComponent, title: 'ZZZAcademy - W-Engines' },
  { path: 'discos', component: DiscosComponent, title: 'ZZZAcademy - Pistas de Datos' },
  { path: 'bangboos', component: BangboosComponent, title: 'ZZZAcademy - Bangboos' },
  { path: 'tier-list', component: TierListComponent, title: 'ZZZAcademy - Tier List' },
  // Zona Secreta Admin
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard], title: 'ZZZAcademy - Administración' },
  // Aquí irá el Roster protegido en el futuro:
  { path: 'roster', component: RosterComponent, canActivate: [authGuard], title: 'ZZZAcademy - Mi Roster' },
  { path: '', redirectTo: '/agentes', pathMatch: 'full' }
];
