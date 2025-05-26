import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { MedicationComponent } from './components/medication/medication.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { IncidentsComponent } from './components/incidents/incidents.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VoiceAlertsComponent } from './components/voice-alerts/voice-alerts.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationService } from './services/notification.service';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { VoiceAlertService } from './services/voice-alert.service';
import { LandingComponent } from './components/landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MedicationComponent,
    IncidentsComponent,
    DashboardComponent,
    VoiceAlertsComponent,
    LoaderComponent,
    NotificationComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    GridModule,
    DialogsModule,
    ButtonsModule,
    BrowserAnimationsModule,
    FormsModule,
    FormFieldModule,
    LabelModule,
    DateInputsModule,
    IntlModule,
    DropDownsModule,
    InputsModule,
    ChartsModule
  ],
  exports: [LoaderComponent],
  providers: [NotificationService, VoiceAlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
