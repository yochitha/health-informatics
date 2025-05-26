import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MedicationComponent } from './components/medication/medication.component';
import { AuthGuard } from './_helpers/auth.guard';
import { IncidentsComponent } from './components/incidents/incidents.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LandingComponent } from './components/landing/landing.component';

const routes: Routes = [
    { path: '', component: LandingComponent, canActivate: [AuthGuard]},
    { path: 'medication', component: MedicationComponent, canActivate: [AuthGuard] },
    { path: 'incidents', component: IncidentsComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
